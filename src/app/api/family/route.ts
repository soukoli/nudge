import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateFamilyInput, ApiResponse } from '@/lib/types';
import { generateShareCode } from '@/lib/utils';
import { Family, FamilyMember, Asset } from '@/lib/db';

type FamilyWithRelations = Family & {
  members: FamilyMember[];
  assets: Asset[];
};

// GET /api/family - Get all families (for development) or family by shareCode
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shareCode = searchParams.get('shareCode');
    const id = searchParams.get('id');

    if (shareCode) {
      const family = await prisma.family.findUnique({
        where: { shareCode },
        include: {
          members: {
            orderBy: { createdAt: 'asc' },
          },
          assets: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!family) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Family not found' },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<typeof family>>({
        success: true,
        data: family,
      });
    }

    if (id) {
      const family = await prisma.family.findUnique({
        where: { id },
        include: {
          members: {
            orderBy: { createdAt: 'asc' },
          },
          assets: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!family) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Family not found' },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<typeof family>>({
        success: true,
        data: family,
      });
    }

    // Return all families (for development/demo)
    const families = await prisma.family.findMany({
      include: {
        members: true,
        assets: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<ApiResponse<typeof families>>({
      success: true,
      data: families,
    });
  } catch (error) {
    console.error('Error fetching family:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch family' },
      { status: 500 }
    );
  }
}

// POST /api/family - Create a new family
export async function POST(request: NextRequest) {
  try {
    const body: CreateFamilyInput = await request.json();

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Family name is required' },
        { status: 400 }
      );
    }

    const family = await prisma.family.create({
      data: {
        name: body.name.trim(),
        shareCode: generateShareCode(),
        members: body.members
          ? {
              create: body.members.map((member) => ({
                name: member.name,
                nickname: member.nickname,
                avatarUrl: member.avatarUrl,
                birthDate: member.birthDate ? new Date(member.birthDate) : null,
                memberType: member.memberType || 'ADULT',
              })),
            }
          : undefined,
        assets: body.assets
          ? {
              create: body.assets.map((asset) => ({
                name: asset.name,
                assetType: asset.assetType,
                description: asset.description,
                imageUrl: asset.imageUrl,
              })),
            }
          : undefined,
      },
      include: {
        members: true,
        assets: true,
      },
    });

    return NextResponse.json<ApiResponse<typeof family>>(
      { success: true, data: family },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create family' },
      { status: 500 }
    );
  }
}

// PUT /api/family - Update a family
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Family ID is required' },
        { status: 400 }
      );
    }

    const family = await prisma.family.update({
      where: { id },
      data: {
        name: updateData.name,
      },
      include: {
        members: true,
        assets: true,
      },
    });

    return NextResponse.json<ApiResponse<typeof family>>({
      success: true,
      data: family,
    });
  } catch (error) {
    console.error('Error updating family:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to update family' },
      { status: 500 }
    );
  }
}

// DELETE /api/family - Delete a family
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Family ID is required' },
        { status: 400 }
      );
    }

    await prisma.family.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
    });
  } catch (error) {
    console.error('Error deleting family:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to delete family' },
      { status: 500 }
    );
  }
}
