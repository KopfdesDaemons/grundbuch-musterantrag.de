import sys
import os
import time
import json

# Ensure LibreOffice program dir is in PYTHONPATH (needed on Alpine/Linux)
for p in ('/usr/lib/libreoffice/program', '/usr/lib64/libreoffice/program'):
    if os.path.isdir(p) and p not in sys.path:
        sys.path.append(p)

import uno
from com.sun.star.beans import PropertyValue # pyright: ignore[reportMissingImports]

# Initialize the local UNO component context and URL resolver
pipe_name = sys.argv[1]
local_ctx = uno.getComponentContext()
resolver = local_ctx.ServiceManager.createInstanceWithContext(
    "com.sun.star.bridge.UnoUrlResolver", local_ctx
)

# Wait for the LibreOffice UNO pipe to become available (up to 5 seconds)
ctx = None
for _ in range(100):
    try:
        ctx = resolver.resolve(f"uno:pipe,name={pipe_name};urp;StarOffice.ComponentContext")
        break
    except Exception:
        time.sleep(0.05)

if ctx is None:
    sys.stderr.write("Failed to connect to LibreOffice UNO pipe\n")
    sys.exit(1)

# Create the LibreOffice desktop instance for handling document operations
smgr = ctx.ServiceManager
desktop = smgr.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)

# Helper function to create a UNO PropertyValue instance
def make_prop(name, val):
    p = PropertyValue()
    p.Name = name
    p.Value = val
    return p

# Define properties for loading documents and exporting to PDF
load_props = (make_prop("Hidden", True), make_prop("ReadOnly", True), make_prop("UpdateDocMode", 0))
store_props = (make_prop("FilterName", "writer_pdf_Export"),)

# Warmup Writer & PDF export filter libraries in memory before marking READY
try:
    warmup_pdf = os.path.join("/tmp", f"lo_warmup_{os.getpid()}.pdf")
    wdoc = desktop.loadComponentFromURL("private:factory/swriter", "_blank", 0, (make_prop("Hidden", True),))
    if wdoc is not None:
        wdoc.storeToURL(uno.systemPathToFileUrl(warmup_pdf), store_props)
        wdoc.close(True)
    if os.path.exists(warmup_pdf):
        os.remove(warmup_pdf)
except Exception:
    pass

# Signal to the parent Node.js process that the worker is ready to accept jobs
sys.stdout.write("READY\n")
sys.stdout.flush()

# Process incoming JSON-encoded conversion requests from stdin line by line
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    req = json.loads(line)
    req_id = req.get("id")
    try:
        in_url = uno.systemPathToFileUrl(os.path.abspath(req["input"]))
        out_url = uno.systemPathToFileUrl(os.path.abspath(req["output"]))
        doc = desktop.loadComponentFromURL(in_url, "_blank", 0, load_props)
        if doc is None:
            raise RuntimeError("loadComponentFromURL returned None")
        try:
            doc.storeToURL(out_url, store_props)
        finally:
            doc.close(True)
        sys.stdout.write(json.dumps({"id": req_id, "ok": True}) + "\n")
    except Exception as e:
        sys.stdout.write(json.dumps({"id": req_id, "ok": False, "error": str(e)}) + "\n")
    sys.stdout.flush()

