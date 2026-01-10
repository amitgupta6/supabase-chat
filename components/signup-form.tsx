"use client";
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client";
import { DOMAttributes, FormEvent, useState } from "react"
import Link from "next/link";


export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string>('');
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    const formData = new FormData(currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirm_password = formData.get("confirm_password");
    setError("");
    setSuccess("");
    if(email == ""){
      setError("Please provide email address");
      return;
    }
    if(password == ""){
      setError("Enter password");
      return;
    }
    if(password?.toString().length! < 8){
      setError(`Password should be of minimum 8 characters`);
      return;
    }
    if(password != confirm_password){
      setError(`Password and confirm password do not match`);
      return;
    }
    const {data, error} = await supabase.auth.signUp({
      email: email?.toString()!,
      password: password?.toString()!,
      options: {
        emailRedirectTo: `http://localhost:3000/chat`
      }
    });
    if(error){
      setError(error.message);
      return;
    }
    if(data.user?.confirmation_sent_at){
      setError('')
      setSuccess(`Signup Successful. Confirmation email sent. Please check your inbox.`);
      return;
    }
    console.log("error" ,error);
    console.log("data", data);
  }
  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex items-center justify-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">Supabase Chat</span>
        </div>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      {!success && <CardContent>
        <form onSubmit={onSubmitHandler}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={loading}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input name="password" id="password" type="password" required disabled={loading} />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input name="confirm_password" id="confirm-password" type="password" required disabled={loading} />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            {error && <div className="text-red-600 font-medium text-xs text-center">
              {error}
            </div>}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>Create Account</Button>
                <Button variant="outline" type="button" disabled={loading}>
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>}
      {success && <CardContent>
        <div className="text-md text-green-600">A confirmation email has been sent to your email address. Please check.</div>
      </CardContent>}
    </Card>
  )
}
