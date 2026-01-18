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
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Database } from "@/types/database"

export default function ProfilePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>();
  const loadBuckets = async () => {
    // const { data, error } = await supabase.storage.from("avatars").list("profile-amir", {limit: 100});
    // console.log("data", data);
    // console.log("error", error);
    const data = supabase.storage.from("avatars").getPublicUrl("profile-amir/amir-khan.jpeg");
    console.log("data", data);
    // console.log("error", error);
  }
  useEffect(() => {
    loadBuckets();
  }, []);
  const loadProfile = async () => {
    const { data: { user }, error: userRetrievalError } = await supabase.auth.getUser();
    if (userRetrievalError) {
      console.log("userRetrievalError", userRetrievalError);
      return;
    }
    if (!user?.id) return;
    const { data: profile, error } = await supabase.from("profiles").select().eq("id", user.id);
    setProfile(profile?.[0]);
    if (profile?.[0].avatar) {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(profile?.[0].avatar);
      setImageUrl(publicUrl);
      console.log("publicUrl", publicUrl);
    }
  }
  useEffect(() => {
    loadProfile();
  }, [])
  const handleFileUpload = async (file: File) => {
    const { data: { user }, error: userRetrievalError } = await supabase.auth.getUser();
    if (userRetrievalError) {
      return;
    }
    const userId = user?.id;
    if (!user?.id) return;
    const fileName = crypto.randomUUID()
    const extension = file.name.split('.').pop();
    const { data, error } = await supabase.storage.from("avatars").upload(`${userId}/${fileName}.${extension}`, file, { upsert: true });
    setImageUrl(URL.createObjectURL(file));
    const { data: updateData, error: updateError } = await supabase.from("profiles").update({
      avatar: data?.path
    }).eq('id', user?.id).select();
  }

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
                {!imageUrl && <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  {!imageUrl && <User className="w-12 h-12 text-muted-foreground" />}
                </div>}
                {imageUrl && <img src={imageUrl} className="w-24 h-24 rounded-full bg-muted flex items-center justify-center" />}
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (!file) return;
                      handleFileUpload(file);
                    }}
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
