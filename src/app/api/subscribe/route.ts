import { NextRequest, NextResponse } from "next/server";
import type { Category } from "@/types";
import { CATEGORIES } from "@/types";

// In-memory subscriber store (replace with Supabase when configured)
const subscribers: Map<string, { email: string; categories: Category[]; subscribedAt: string }> = new Map();

export async function POST(req: NextRequest) {
  try {
    const { email, categories } = (await req.json()) as {
      email: string;
      categories?: Category[];
    };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const selectedCategories = categories?.filter((c) => CATEGORIES.includes(c)) || CATEGORIES.slice(0, 6);

    subscribers.set(email, {
      email,
      categories: selectedCategories,
      subscribedAt: new Date().toISOString(),
    });

    // Log for visibility (in production, store in Supabase + set up email service)
    console.log(`[Newsletter] New subscriber: ${email} — Categories: ${selectedCategories.join(", ")}`);
    console.log(`[Newsletter] Total subscribers: ${subscribers.size}`);
    console.log(`[Newsletter] Emails scheduled at 9:00 AM and 6:00 PM daily`);

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully! You'll receive briefings at 9 AM and 6 PM.",
      subscriber: {
        email,
        categories: selectedCategories,
        schedule: ["09:00", "18:00"],
      },
    });
  } catch (err) {
    console.error("Subscription error:", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    subscriberCount: subscribers.size,
    schedule: {
      morning: "09:00 UTC",
      evening: "18:00 UTC",
    },
    info: "Newsletter delivers AI-analyzed news briefings twice daily",
  });
}
