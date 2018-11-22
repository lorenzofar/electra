export default interface User {
    email: string;
    name: string;
    surname: string;
    gender?: "male" | "female";
    profile_image?: string;
    rank?: number;
    role?: "standard" | "admin" | "trainer" | "nutritionist" | "psychologist";
    birthday?: Date;
}
