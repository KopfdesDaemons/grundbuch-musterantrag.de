import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Antrag } from '../../interfaces/antrag';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  http = inject(HttpClient);

  async generatePdf(antrag: Antrag): Promise<Blob | undefined> {
    const form = new FormData();
    form.append('uploadinfo', JSON.stringify({ antragsart: antrag.title, grundbuchamt: antrag.grundbuchamt.name }));
    form.append('antrag', JSON.stringify(antrag));
    const url = '/api/submitForm';

    try {
      const response = await lastValueFrom(
        this.http.post(url, form, {
          responseType: 'blob'
        })
      );
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        // New instance of HttpErrorResponse is needed because the error.error is a Blob and not a JSON object
        const errorMessage = JSON.parse(await error.error.text()).message;
        throw new HttpErrorResponse({
          error: { message: errorMessage },
          headers: error.headers,
          status: error.status,
          statusText: error.statusText,
          url: error.url || undefined
        });
      }
      return undefined;
    }
  }
}
