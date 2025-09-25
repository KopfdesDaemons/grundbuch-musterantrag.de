import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Antrag } from '../../interfaces/antrag';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  uploadID = signal<string | undefined>(undefined);

  async submitForm(antrag: Antrag): Promise<string> {
    const url = '/api/submitForm';
    const response = await lastValueFrom(this.http.post(url, { antrag: antrag }));
    const { uploadID } = response as { uploadID: string };
    this.uploadID.set(uploadID);
    return uploadID;
  }

  async getPdfAfterSubmitForm(uploadID: string): Promise<Blob> {
    const url = `/api/getPdfAfterSubmitForm?uploadID=${uploadID}`;
    try {
      const response = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw await this.getHttpErrorWithMessageParsedFromBody(error);
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
        throw await this.getHttpErrorWithMessageParsedFromBody(error);
      }
      throw new Error('getOdtAfterSubmitForm failed without HttpErrorResponse');
    }
  }

  async getHttpErrorWithMessageParsedFromBody(error: HttpErrorResponse): Promise<HttpErrorResponse> {
    const errorMessage = JSON.parse(await error.error.text()).message;
    throw new HttpErrorResponse({
      error: { message: errorMessage },
      headers: error.headers,
      status: error.status,
      statusText: error.statusText,
      url: error.url || undefined
    });
  }

  async reportDownloadByUser(uploadID: string, fileType: 'odtFile' | 'pdfFile'): Promise<void> {
    const url = '/api/uploads/reportDownloadByUser';
    await lastValueFrom(this.http.put(url, { uploadID, fileType }));
  }
}
