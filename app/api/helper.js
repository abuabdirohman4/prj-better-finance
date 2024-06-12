import { NextResponse } from "next/server";

export function validateField(field) {
  if (!field) {
    return NextResponse.json(
      { error: `Missing ${field} field` },
      { status: 400 }
    );
  }
}


export function validateFields(fields) {
  for (const field of fields) {
    if (!field.value) {
      return NextResponse.json(
        { error: `Missing required fields` },
        { status: 400 }
      );
    }
  }
}