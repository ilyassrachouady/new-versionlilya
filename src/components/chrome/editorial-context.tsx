"use client";
import { createContext, useContext } from "react";
import { rituals, ingredients, needs } from "@/lib/content";
const defaults = { rituals, ingredients, needs };
import { contactDefaults } from "@/lib/contact-content";
const ContactContext = createContext(contactDefaults);
export const ContactProvider = ContactContext.Provider;
export function useContactContent() { return useContext(ContactContext); }
const EditorialContext = createContext(defaults);
export function EditorialProvider({ value, children }: { value: typeof defaults; children: React.ReactNode }) { return <EditorialContext.Provider value={value}>{children}</EditorialContext.Provider>; }
export function useEditorial() { return useContext(EditorialContext); }
