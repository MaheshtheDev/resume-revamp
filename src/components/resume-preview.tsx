import { Resume } from '@/types';
import { Link, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    try {
      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10; // margin in mm
      const contentWidth = pageWidth - margin * 2;

      // Get all section elements
      const sections = resumeRef.current.querySelectorAll('> div');
      let currentY = margin;
      let isFirstSection = true;

      // Process each section
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;

        // Create a new page for each section except the first one
        if (!isFirstSection && currentY > margin) {
          pdf.addPage();
          currentY = margin;
        }

        // Capture section as canvas
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        // Check if section fits on current page
        if (currentY + imgHeight > pageHeight - margin) {
          // If not first section and doesn't fit, add a new page
          if (!isFirstSection) {
            pdf.addPage();
            currentY = margin;
          }
        }

        // Add section to PDF
        pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, imgHeight);

        // Update Y position for next section
        currentY += imgHeight + 5; // 5mm spacing between sections
        isFirstSection = false;
      }

      pdf.save(`${resume.name.replace(/\s+/g, '_')}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="h-full flex flex-col over overflow-y-scroll">
      <div className="p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-semibold dark:text-white">Resume Preview</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
          ref={resumeRef}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-8 space-y-6 max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold uppercase tracking-wide dark:text-white">
              {resume.name}
            </h1>
            <div className="text-sm flex items-center justify-center gap-2 dark:text-gray-300">
              <span>{resume.location}</span>
              <span>•</span>
              <span>{resume.phone}</span>
              <span>•</span>
              <span>{resume.email}</span>
              {resume.linkedin && (
                <>
                  <span>•</span>
                  <a
                    href={resume.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Link className="w-3 h-3" />
                    LinkedIn
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Professional Experience Section */}
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 dark:border-gray-600 pb-1 mb-4 dark:text-white">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-bold dark:text-white">{exp.title}</h3>
                      <div className="text-sm">
                        <span className="font-bold dark:text-gray-300">
                          {exp.company}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm dark:text-gray-400">
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <ul className="list-disc ml-4 mt-2 text-sm space-y-1 dark:text-gray-300">
                    {exp.description.split('\n').map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          {resume.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 dark:border-gray-600 pb-1 mb-4 dark:text-white">
                Projects
              </h2>
              <div className="space-y-4">
                {resume.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold dark:text-white">
                        {project.name}
                      </h3>
                      {project.date && (
                        <div className="text-sm dark:text-gray-400">
                          {project.date}
                        </div>
                      )}
                    </div>
                    <ul className="list-disc ml-4 mt-1 text-sm dark:text-gray-300">
                      {project.description.split('\n').map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 dark:border-gray-600 pb-1 mb-4 dark:text-white">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="font-bold dark:text-white">
                        {edu.school}
                      </div>
                      <div className="text-sm dark:text-gray-300">
                        {edu.degree}
                      </div>
                    </div>
                    <div className="text-sm dark:text-gray-400">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Other Section */}
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 dark:border-gray-600 pb-1 mb-4 dark:text-white">
              Skills & Other
            </h2>
            <div className="space-y-2">
              {resume.skillCategories?.map((category, index) => (
                <div key={index} className="text-sm dark:text-gray-300">
                  <span className="font-bold dark:text-white">
                    {category.name}:
                  </span>{' '}
                  <span>{category.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
