"use client"

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

export default function PasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            {/* Current Password */}
            <Field>
              <FieldLabel htmlFor="current-password">
                Current Password
              </FieldLabel>
              <Input id="current-password" type="password" required />
              <FieldDescription>
                Enter your current password to verify your identity.
              </FieldDescription>
            </Field>

            {/* New Password */}
            <Field>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input id="new-password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm New Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>
                Re-enter your new password to confirm.
              </FieldDescription>
            </Field>

            {/* Submit Button */}
            <Field>
              <Button type="submit">Update Password</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
