import { Injectable, Renderer2, inject, DOCUMENT } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  private document = inject<Document>(DOCUMENT);

  addJsScript(renderer: Renderer2, src: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingScript = this.document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.onload = () => resolve(); // Erfolgreich geladen.
      script.onerror = () => reject(new Error(`Error loading script: ${src}`));
      renderer.appendChild(this.document.body, script);
    });
  }

  async reloadJsScript(renderer: Renderer2, src: string) {
    this.removeJsScript(src);
    await this.addJsScript(renderer, src);
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
