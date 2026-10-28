import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Antrag } from '../../interfaces/antrag';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly _uploadID = signal<string | undefined>(undefined);
  readonly uploadID = this._uploadID.asReadonly();

  setUploadID(uploadID: string | undefined): void {
    this._uploadID.set(uploadID);
  }

  async submitForm(antrag: Antrag): Promise<string> {
    const url = '/api/submitForm';
    const response = await lastValueFrom(this.http.post(url, { antrag: antrag, uploadID: this._uploadID() }));
    const { uploadID } = response as { uploadID: string };
    this._uploadID.set(uploadID);
    return uploadID;
  }

  async loadFormSection(uploadID: string | undefined, antragsart: string, section: string, stepOrder: number): Promise<string> {
    const url = '/api/uploads/section/load';
    const response = await lastValueFrom(this.http.post(url, { uploadID, antragsart, section, stepOrder }));
    const { uploadID: activeUploadID } = response as { uploadID: string };
    this._uploadID.set(activeUploadID);
    return activeUploadID;
  }

  async completeFormSection(uploadID: string, section: string): Promise<void> {
    const url = '/api/uploads/section/complete';
    await lastValueFrom(this.http.post(url, { uploadID, section }));
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

  async submitFeedback(rating: number, uploadID?: string): Promise<void> {
    const activeUploadID = uploadID ?? this._uploadID();
    const url = '/api/feedback/rating';
    await lastValueFrom(this.http.post(url, { rating, uploadID: activeUploadID }));
  }
}
