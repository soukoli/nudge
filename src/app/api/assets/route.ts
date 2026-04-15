import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateAssetInput, UpdateAssetInput, ApiResponse } from '@/lib/types';

// GET /api/assets - Get assets by familyId
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const familyId = searchParams.get('familyId');
    const id = searchParams.get('id');

    if (id) {
      const asset = await prisma.asset.findUnique({
        where: { id },
        include: {
          nudges: {
            include: {
              completions: {
                orderBy: { completedAt: 'desc' },
                take: 5,
              },
            },
          },
        },
      });

      if (!asset) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Asset not found' },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<typeof asset>>({
        success: true,
        data: asset,
      });
    }

    if (!familyId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Family ID is required' },
        { status: 400 }
      );
    }

    const assets = await prisma.asset.findMany({
      where: { familyId },
      include: {
        nudges: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json<ApiResponse<typeof assets>>({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

// POST /api/assets - Create a new asset
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

    const body: CreateAssetInput = await request.json();

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Asset name is required' },
        { status: 400 }
      );
    }

    if (!body.assetType) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Asset type is required' },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.create({
      data: {
        familyId,
        name: body.name.trim(),
        assetType: body.assetType,
        description: body.description?.trim(),
        imageUrl: body.imageUrl,
      },
      include: {
        nudges: true,
      },
    });

    return NextResponse.json<ApiResponse<typeof asset>>(
      { success: true, data: asset },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}

// PUT /api/assets - Update an asset
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData }: { id: string } & UpdateAssetInput = body;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Asset ID is required' },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        name: updateData.name?.trim(),
        assetType: updateData.assetType,
        description: updateData.description?.trim(),
        imageUrl: updateData.imageUrl,
      },
      include: {
        nudges: true,
      },
    });

    return NextResponse.json<ApiResponse<typeof asset>>({
      success: true,
      data: asset,
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to update asset' },
      { status: 500 }
    );
  }
}

// DELETE /api/assets - Delete an asset
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Asset ID is required' },
        { status: 400 }
      );
    }

    await prisma.asset.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse<{ deleted: boolean }>>({
      success: true,
      data: { deleted: true },
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
