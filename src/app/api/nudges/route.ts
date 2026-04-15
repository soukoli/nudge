import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { CreateNudgeInput, UpdateNudgeInput, ApiResponse } from '@/lib/types';

// GET /api/nudges - Get nudges for a family
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const familyId = searchParams.get('familyId');
    const memberId = searchParams.get('memberId'); // Current user's member ID
    const id = searchParams.get('id');
    const visibility = searchParams.get('visibility'); // 'shared' | 'personal' | 'all'

    // Get single nudge by ID
    if (id) {
      const nudge = await prisma.nudge.findUnique({
        where: { id },
        include: {
          member: true,
          asset: true,
          targetMember: true,
          completions: {
            orderBy: { completedAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!nudge) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Nudge not found' },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<typeof nudge>>({
        success: true,
        data: nudge,
      });
    }

    if (!familyId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Family ID is required' },
        { status: 400 }
      );
    }

    // Build where clause based on visibility and member
    let whereClause: any = { familyId, isActive: true };

    if (visibility === 'shared') {
      // Only shared nudges (visible to everyone)
      whereClause.visibility = 'SHARED';
    } else if (visibility === 'personal' && memberId) {
      // Only personal nudges for this specific member
      whereClause.visibility = 'PERSONAL';
      whereClause.targetMemberId = memberId;
    } else if (memberId) {
      // All nudges visible to this member (shared + their personal)
      whereClause.OR = [
        { visibility: 'SHARED' },
        { visibility: 'PERSONAL', targetMemberId: memberId },
      ];
      delete whereClause.familyId; // Will be in the OR conditions
      whereClause = {
        isActive: true,
        OR: [
          { familyId, visibility: 'SHARED' },
          { familyId, visibility: 'PERSONAL', targetMemberId: memberId },
        ],
      };
    }

    const nudges = await prisma.nudge.findMany({
      where: whereClause,
      include: {
        member: {
          select: { id: true, name: true, avatarUrl: true, memberType: true },
        },
        asset: {
          select: { id: true, name: true, assetType: true },
        },
        targetMember: {
          select: { id: true, name: true },
        },
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: [
        { category: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json<ApiResponse<typeof nudges>>({
      success: true,
      data: nudges,
    });
  } catch (error) {
    console.error('Error fetching nudges:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch nudges' },
      { status: 500 }
    );
  }
}

// POST /api/nudges - Create a new nudge
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const familyId = searchParams.get('familyId');
    
    if (!familyId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Family ID is required' },
        { status: 400 }
      );
    }

    const body: CreateNudgeInput = await request.json();

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Nudge title is required' },
        { status: 400 }
      );
    }

    const nudge = await prisma.nudge.create({
      data: {
        familyId,
        title: body.title.trim(),
        description: body.description?.trim(),
        emoji: body.emoji,
        category: body.category,
        memberId: body.memberId,
        assetId: body.assetId,
        visibility: body.visibility || 'SHARED',
        targetMemberId: body.targetMemberId,
        frequency: body.frequency || 'DAILY',
        frequencyDays: body.frequencyDays || [],
      },
      include: {
        member: true,
        asset: true,
        targetMember: true,
      },
    });

    return NextResponse.json<ApiResponse<typeof nudge>>(
      { success: true, data: nudge },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating nudge:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create nudge' },
      { status: 500 }
    );
  }
}

// PUT /api/nudges - Update a nudge
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData }: { id: string } & UpdateNudgeInput = body;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Nudge ID is required' },
        { status: 400 }
      );
    }

    const nudge = await prisma.nudge.update({
      where: { id },
      data: {
        title: updateData.title?.trim(),
        description: updateData.description?.trim(),
        emoji: updateData.emoji,
        category: updateData.category,
        visibility: updateData.visibility,
        targetMemberId: updateData.targetMemberId,
        frequency: updateData.frequency,
        frequencyDays: updateData.frequencyDays,
        isActive: updateData.isActive,
      },
      include: {
        member: true,
        asset: true,
        targetMember: true,
      },
    });

    return NextResponse.json<ApiResponse<typeof nudge>>({
      success: true,
      data: nudge,
    });
  } catch (error) {
    console.error('Error updating nudge:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to update nudge' },
      { status: 500 }
    );
  }
}

// DELETE /api/nudges - Delete a nudge
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Nudge ID is required' },
        { status: 400 }
      );
    }

    await prisma.nudge.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
    });
  } catch (error) {
    console.error('Error deleting nudge:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to delete nudge' },
      { status: 500 }
    );
  }
}
