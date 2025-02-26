import { NextRequest, NextResponse } from 'next/server';
import { parseOfficeAsync, type OfficeParserConfig } from 'officeparser';
import { structuredResume } from '@/agents/structured-resume';
const SUPPORTED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/pdf', // PDF
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Please upload a DOCX or PDF file' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Configure officeparser
    const config: OfficeParserConfig = {
      outputErrorToConsole: false,
      newlineDelimiter: '\n',
      ignoreNotes: false,
      putNotesAtLast: false,
    };

    // Note: PDF extraction might not work in browser bundles according to officeparser docs
    const content = await parseOfficeAsync(Buffer.from(arrayBuffer), config);

    const result = await structuredResume(content);

    return NextResponse.json({ result: result.object });
  } catch (error) {
    console.error('Document parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse document' },
      { status: 500 }
    );
  }
}
