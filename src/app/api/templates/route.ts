import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponse } from '@/lib/types';
import { MemberType, AssetType } from '@/lib/db';

// GET /api/templates - Get nudge templates filtered by member type or asset type
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const memberType = searchParams.get('memberType') as MemberType | null;
    const assetType = searchParams.get('assetType') as AssetType | null;
    const builtInOnly = searchParams.get('builtInOnly') === 'true';

    let whereClause: any = {};

    if (memberType) {
      whereClause = {
        ...whereClause,
        memberTypes: { has: memberType },
        applicableTo: { in: ['MEMBER', 'ANY'] },
      };
    }

    if (assetType) {
      whereClause = {
        ...whereClause,
        assetTypes: { has: assetType },
        applicableTo: { in: ['ASSET', 'ANY'] },
      };
    }

    if (builtInOnly) {
      whereClause.isBuiltIn = true;
    }

    const templates = await prisma.nudgeTemplate.findMany({
      where: whereClause,
      orderBy: { category: 'asc' },
    });

    return NextResponse.json<ApiResponse<typeof templates>>({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
