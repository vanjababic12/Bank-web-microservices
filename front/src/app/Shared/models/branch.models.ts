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
    customerUsername: string; // Korisničko ime umesto imena kupca
    isBooked: boolean; // Proverava da li je termin zauzet
    isCanceled: boolean; // Proverava da li je termin otkazan
    branch: Branch;

    constructor(id: number, branchId: number, appointmentDate: Date, customerUsername: string, branch: Branch) {
        this.id = id;
        this.branchId = branchId;
        this.appointmentDate = appointmentDate;
        this.customerUsername = customerUsername;
        this.isBooked = !!(customerUsername && customerUsername.trim().length > 0);
        this.branch = branch;
    }
}

export class CreateAppointmentDto {
    branchId: number;
    appointmentDate: String; // Datum termina
    customerUsername?: string; // Korisničko ime umesto imena kupca, opcionalno

    constructor(branchId: number, appointmentDate: String, customerUsername?: string) {
        this.branchId = branchId;
        this.appointmentDate = appointmentDate;
        this.customerUsername = customerUsername;
    }
}


export type SelectFormControl = FormControl & { value: string };
