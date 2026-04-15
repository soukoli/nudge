import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/types';

// POST /api/nudges/complete - Mark a nudge as done
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nudgeId, memberId, note } = body;

    if (!nudgeId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Nudge ID is required' },
        { status: 400 }
      );
    }

    // Create completion record
    const completion = await prisma.nudgeCompletion.create({
      data: {
        nudgeId,
        completedBy: memberId || null,
        note: note?.trim() || null,
      },
      include: {
        nudge: true,
        member: true,
      },
    });

    // Update the nudge's lastDoneAt
    await prisma.nudge.update({
      where: { id: nudgeId },
      data: {
        lastDoneAt: new Date(),
        lastShownAt: new Date(),
      },
    });

    return NextResponse.json<ApiResponse<typeof completion>>({
      success: true,
      data: completion,
    });
  } catch (error) {
    console.error('Error completing nudge:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to complete nudge' },
      { status: 500 }
    );
  }
}

// GET /api/nudges/complete - Get completions for a nudge
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nudgeId = searchParams.get('nudgeId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!nudgeId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Nudge ID is required' },
        { status: 400 }
      );
    }

    const completions = await prisma.nudgeCompletion.findMany({
      where: { nudgeId },
      include: {
        member: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json<ApiResponse<typeof completions>>({
      success: true,
      data: completions,
    });
  } catch (error) {
    console.error('Error fetching completions:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch completions' },
      { status: 500 }
    );
  }
}
