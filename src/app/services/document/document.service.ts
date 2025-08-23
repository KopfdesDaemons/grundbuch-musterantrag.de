import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Antrag } from '../../interfaces/antrag';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  http = inject(HttpClient);

  async submitForm(antrag: Antrag): Promise<string> {
    const form = new FormData();
    form.append('uploadinfo', JSON.stringify({ antragsart: antrag.title, grundbuchamt: antrag.grundbuchamt.name }));
    form.append('antrag', JSON.stringify(antrag));
    const url = '/api/submitForm';

    const response = await lastValueFrom(this.http.post(url, form));
    const { uploadID } = response as { uploadID: string };
    return uploadID;
  }

  async getPdfAfterSubmitForm(uploadID: string): Promise<Blob> {
    const url = `/api/getPdfAfterSubmitForm?uploadID=${uploadID}`;
    try {
      const response = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
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
      throw new Error('getPdfAfterSubmitForm failed without HttpErrorResponse');
    }
  }

  async getOdtAfterSubmitForm(uploadID: string): Promise<Blob> {
    const url = `/api/getOdtAfterSubmitForm?uploadID=${uploadID}`;
    try {
      const response = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
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
      throw new Error('getOdtAfterSubmitForm failed without HttpErrorResponse');
    }
  }
}
