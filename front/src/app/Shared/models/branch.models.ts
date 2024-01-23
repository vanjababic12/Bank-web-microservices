import { FormControl } from "@angular/forms";

export class BranchDto {
    name: string;
    address: string;
    phoneNumber: string;
    openingTime: string;
    closingTime: string;

    constructor(name: string, address: string, phoneNumber: string, openingTime: string, closingTime: string) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
    }
}

export class AppointmentDto {
    appointmentId: number;

    constructor(appointmentId: number) {
        this.appointmentId = appointmentId;
    }
}

export class Branch {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    openingTime: string; // Pretpostavljamo ISO 8601 format "HH:mm:ss"
    closingTime: string; // Pretpostavljamo ISO 8601 format "HH:mm:ss"

    constructor(id: number, name: string, address: string, phoneNumber: string, openingTime: string, closingTime: string) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
    }
}

export class Appointment {
    id: number;
    branchId: number;
    appointmentDate: Date; // Datum termina
    appointmentTime: string; // Vreme termina kao string (npr. "14:00")
    customerUsername: string; // Korisničko ime umesto imena kupca
    isBooked: boolean; // Proverava da li je termin zauzet

    constructor(id: number, branchId: number, appointmentDate: Date, appointmentTime: string, customerUsername: string) {
        this.id = id;
        this.branchId = branchId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.customerUsername = customerUsername;
        this.isBooked = !!(customerUsername && customerUsername.trim().length > 0);
    }
}

export type SelectFormControl = FormControl & { value: string };
