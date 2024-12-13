import { DOCUMENT } from '@angular/common';
import { Injectable, Renderer2, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  private document = inject<Document>(DOCUMENT);


  addJsScript(renderer: Renderer2, src: string) {
    const existingScript = this.document.querySelector(`script[src="${src}"]`);
    if (existingScript) return;

    const script = renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    renderer.appendChild(this.document.body, script);
  }

  reloadJsScript(renderer: Renderer2, src: string) {
    this.removeJsScript(src);
    this.addJsScript(renderer, src)
  }

  removeJsScript(src: string): void {
    const existingScript = this.document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      existingScript.remove();
    }
  }

  ceckIfJsScriptExist(src: string): boolean {
    return !!this.document.querySelector(`script[src="${src}"]`);
  }
}
