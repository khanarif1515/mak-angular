import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  formatDate(value: string | Date, format: string): string {
    const date = new Date(value);
    return this.customFormat(date, format);
  }

  diffInDays(value: string | Date, addDays: number = 0): number {
    const date = new Date(value);
    const diffTime = Math.abs(date.getTime() - new Date().getTime());
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    diffDays += addDays;
    return diffDays;
  }

  diffInMonths(value: string | Date, compareTo: string | Date): number {
    const date1 = new Date(value);
    const date2 = new Date(compareTo);
    return (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth());
  }

  toRelativeTime(value: string | Date): string {
    const date = new Date(value);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    if (diffMinutes > 0) return `${diffMinutes} minutes ago`;
    return `${diffSeconds} seconds ago`;
  }

  isAfter(value: string | Date, compareTo: string | Date): boolean {
    const date1 = new Date(value);
    const date2 = new Date(compareTo);
    return date1.getTime() > date2.getTime();
  }

  diffInPreviousDays(value: string | Date): number {
    const date = new Date(value);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  addMonth(value: string | Date, months: number): Date {
    const date = new Date(value);
    date.setMonth(date.getMonth() + months);
    return date;
  }

  getAddedMonth(value: string | Date, months: number, format: string): string {
    const date = this.addMonth(value, months);
    return this.customFormat(date, format);
  }

  private customFormat(date: Date, format: string): string {
    const map: { [key: string]: number | string } = {
      'MM': ('0' + (date.getMonth() + 1)).slice(-2),
      'dd': ('0' + date.getDate()).slice(-2),
      'yyyy': date.getFullYear(),
      'HH': ('0' + date.getHours()).slice(-2),
      'mm': ('0' + date.getMinutes()).slice(-2),
      'ss': ('0' + date.getSeconds()).slice(-2),
    };

    return format.replace(/MM|dd|yyyy|HH|mm|ss/g, matched => map[matched].toString());
  }
}
