import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateMemberInput, UpdateMemberInput, ApiResponse } from '@/lib/types';

// GET /api/members - Get members by familyId
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const familyId = searchParams.get('familyId');
    const id = searchParams.get('id');

    if (id) {
      const member = await prisma.familyMember.findUnique({
        where: { id },
        include: {
          targetedNudges: {
            include: {
              completions: {
                orderBy: { completedAt: 'desc' },
                take: 5,
              },
            },
          },
        },
      });

      if (!member) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<typeof member>>({
        success: true,
        data: member,
      });
    }

    if (!familyId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Family ID is required' },
        { status: 400 }
      );
    }

    const members = await prisma.familyMember.findMany({
      where: { familyId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json<ApiResponse<typeof members>>({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST /api/members - Create a new member
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

    const body: CreateMemberInput = await request.json();

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Member name is required' },
        { status: 400 }
      );
    }

    const member = await prisma.familyMember.create({
      data: {
        familyId,
        name: body.name.trim(),
        nickname: body.nickname?.trim(),
        avatarUrl: body.avatarUrl,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        memberType: body.memberType || 'ADULT',
      },
    });

    return NextResponse.json<ApiResponse<typeof member>>(
      { success: true, data: member },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create member' },
      { status: 500 }
    );
  }
}

// PUT /api/members - Update a member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData }: { id: string } & UpdateMemberInput = body;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const member = await prisma.familyMember.update({
      where: { id },
      data: {
        name: updateData.name?.trim(),
        nickname: updateData.nickname?.trim(),
        avatarUrl: updateData.avatarUrl,
        birthDate: updateData.birthDate ? new Date(updateData.birthDate) : undefined,
        memberType: updateData.memberType,
      },
    });

    return NextResponse.json<ApiResponse<typeof member>>({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE /api/members - Delete a member
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    await prisma.familyMember.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
