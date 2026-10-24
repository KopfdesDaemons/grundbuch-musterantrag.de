/* eslint-disable no-unused-vars */
import { httpResource } from '@angular/common/http';
import { computed, Injectable, linkedSignal, signal } from '@angular/core';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';

/**
 * A generic helper service for managing paginated data.
 * This service is not provided in root, as it needs to be instantiated with specific parameters.
 *
 * @param T The type of the items to be paginated.
 */
@Injectable()
export class PaginatedDataService<T> {
  private readonly _apiUrl = signal<string>('');

  private _getItemId: ((item: T) => string | number) | undefined;

  readonly pageToLoad = signal<number>(1);

  private readonly _params = signal<Record<string, string | number | boolean>>({});

  private readonly _dataResource = httpResource<PaginatedApiResponse<T>>(() => {
    const url = this._apiUrl();
    if (!url) return undefined;
    return {
      url,
      params: {
        page: this.pageToLoad(),
        ...this._params()
      }
    };
  });

  readonly data = this._dataResource.asReadonly();

  private readonly _items = linkedSignal<PaginatedApiResponse<T> | undefined, T[]>({
    source: () => (this.data.hasValue() ? this.data.value() : undefined),
    computation: (source, previous) => {
      if (!source) {
        return previous?.value ?? [];
      }
      if (source.page === 1) {
        return source.items;
      }
      if (previous?.value && Array.isArray(previous.value)) {
        const existingIds = new Set(previous.value.map((item: T) => this._getItemId!(item)));
        const newItems = source.items.filter(item => !existingIds.has(this._getItemId!(item)));
        if (newItems.length === 0) return previous.value;
        return previous.value.concat(newItems);
      }
      return source.items;
    }
  });

  readonly items = this._items.asReadonly();

  readonly loadedPages = computed(() => {
    if (!this.data.hasValue()) return 0;
    return this.data.value().page;
  });

  readonly totalPages = computed<number | undefined>(() => (this.data.hasValue() ? this.data.value()?.totalPages : undefined));
  readonly totalItems = linkedSignal<PaginatedApiResponse<T> | undefined, number | undefined>({
    source: () => (this.data.hasValue() ? this.data.value() : undefined),
    computation: (source, previous) => {
      return source ? source.totalItems : previous?.value;
    }
  }).asReadonly();

  /**
   * Initializes the service with API configuration.
   *
   * @param apiUrl The base URL for the API endpoint.
   * @param getItemId A function to get the unique ID of an item.
   */
  init(apiUrl: string, getItemId: (item: T) => string | number, params: Record<string, string | number | boolean> = {}) {
    this._apiUrl.set(apiUrl);
    this._getItemId = getItemId;
    this._params.set(params);
  }

  setPageToLoad(value: number) {
    this.pageToLoad.set(value);
  }

  setParams(params: Record<string, string | number | boolean>) {
    this._items.set([]);
    this.pageToLoad.set(1);
    this._params.set(params);
  }

  loadData() {
    if (!this._apiUrl()) {
      console.error('PaginatedDataService not initialized. Call init() first.');
      return;
    }
    this._dataResource.reload();
  }

  resetItems() {
    this._items.set([]);
  }
}
