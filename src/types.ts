export interface Passenger {
  id: string;
  name: string;
  passportNumber: string;
  nationality: string;
  visaType: string;
  entryDate: Date;
  visaDurationDays: number;
  daysRemaining: number;
  status: 'valid' | 'expiring' | 'expired' | 'extended';
  alerts: Alert[];
  email: string;
  phone: string;
}

export interface Alert {
  id: string;
  passengerId: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  message: string;
  date: Date;
  read: boolean;
}

export interface VisaUpdate {
  passengerId: string;
  extensionDays: number;
  reason: string;
  date: Date;
}