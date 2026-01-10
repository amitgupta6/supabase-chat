"use client"

import { User } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information and photo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            {/* Photo Upload */}
            <Field>
              <FieldLabel>Photo</FieldLabel>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    className="sr-only"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      Upload Photo
                    </label>
                  </Button>
                  <FieldDescription>
                    JPG, PNG or GIF. Max 2MB.
                  </FieldDescription>
                </div>
              </div>
            </Field>

            {/* Name Field */}
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                defaultValue="John Doe"
              />
              <FieldDescription>
                This is your display name visible to other users.
              </FieldDescription>
            </Field>

            {/* Bio Field */}
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <FieldDescription>
                Brief description for your profile. Max 500 characters.
              </FieldDescription>
            </Field>

            {/* Submit Button */}
            <Field>
              <Button type="submit">Save Changes</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
