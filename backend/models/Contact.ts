export interface ContactRequest {
    id?: number;
    user_id?: number;
    microchip_number?: string;
    pet_keeper?: string;
    phone_number?: string;
    email?: string;
    address?: string;
    country?: string;
    pet_name?: string;
    pet_status?: string;
    payment_status?: string;
    type?: string;
    breed?: string;
    sex?: string;
    color?: string;
    dob?: string;
    otp?: string;
    is_claimed?: string;
    medical_condition?: string;
    markings?: string;
    photo?: string;
    form_type?: string;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
}
