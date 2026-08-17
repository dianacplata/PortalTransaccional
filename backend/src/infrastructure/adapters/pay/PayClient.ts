import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PayClient {
  private readonly http: AxiosInstance;
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor(private readonly config: ConfigService) {
    const baseURL = config.get<string>('PAY_BASE_URL') ?? 'https://sandbox.wompi.co/v1';
    this.publicKey = config.get<string>('PAY_PUBLIC_KEY') ?? '';
    this.privateKey = config.get<string>('PAY_PRIVATE_KEY') ?? '';

    this.http = axios.create({ baseURL });
  }

  async postPublic<T>(path: string, body: unknown): Promise<T> {
    const res = await this.http.post<T>(path, body, {
      headers: { Authorization: `Bearer ${this.publicKey}` },
    });
    return res.data;
  }

  async postPrivate<T>(path: string, body: unknown): Promise<T> {
    const res = await this.http.post<T>(path, body, {
      headers: { Authorization: `Bearer ${this.privateKey}` },
    });
    return res.data;
  }

  async getPublic<T>(path: string): Promise<T> {
    const res = await this.http.get<T>(path, {
      headers: { Authorization: `Bearer ${this.privateKey}` },
    });
    return res.data;
  }

  async getPublicNoAuth<T>(path: string): Promise<T> {
    const res = await this.http.get<T>(path);
    return res.data;
  }

  get pubKey(): string {
    return this.publicKey;
  }
}