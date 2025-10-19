import { Resume } from '@/types';
import { Download, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';

interface ResumePreviewProps {
  resume: Resume;
  previousVersion: Resume | null;
  hideControls?: boolean;
}

export function ResumePreview({
  resume,
  previousVersion,
  hideControls = false,
}: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [showPreviousVersion, setShowPreviousVersion] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const displayedResume =
    showPreviousVersion && previousVersion ? previousVersion : resume;

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    try {
      setIsGenerating(true);

      // Get the HTML content of the resume
      const htmlContent = resumeRef.current.outerHTML;

      // Send to API endpoint
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${displayedResume.name.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You might want to show an error toast here
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleVersion = () => {
    setShowPreviousVersion(!showPreviousVersion);
  };

  return (
    <div className="h-full flex flex-col overflow-y-scroll">
      {!hideControls && (
        <div className="p-3 sm:p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold dark:text-white text-sm sm:text-base">
            {showPreviousVersion ? 'Previous Version' : 'Current Version'}
          </h2>
          <div className="flex items-center gap-1 sm:gap-2">
            {previousVersion && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVersion}
                className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">
                  {showPreviousVersion ? 'Show Current' : 'Show Previous'}
                </span>
                <span className="sm:hidden">
                  {showPreviousVersion ? 'Current' : 'Previous'}
                </span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </span>
              <span className="sm:hidden">
                {isGenerating ? 'Generating...' : 'Download'}
              </span>
            </Button>
          </div>
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto ${hideControls ? 'pt-10' : 'p-2 sm:p-4'}`}
      >
        <div
          ref={resumeRef}
          className="bg-white mx-auto max-w-[816px] px-3 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-8"
          style={{ minHeight: '1056px' }}
        >
          {/* Header Section */}
          <div className="text-center mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold mb-1">
              {displayedResume.name}
            </h1>
            <div className="contact-info flex flex-col sm:flex-row items-center justify-center text-xs sm:text-[13px] leading-none gap-1 sm:gap-0">
              <div className="flex items-center">
                {/*<MapPin className="w-3.5 h-3.5 stroke-[1.5]" />*/}
                <span>{displayedResume.location}</span>
              </div>
              <span className="hidden sm:inline mx-2">•</span>
              {displayedResume.phone && (
                <>
                  <div className="flex items-center">
                    {/*<Phone className="w-3.5 h-3.5 stroke-[1.5]" />*/}
                    <span>{displayedResume.phone}</span>
                  </div>
                  <span className="hidden sm:inline mx-2">•</span>
                </>
              )}
              <div className="flex items-center">
                {/*<Mail className="w-3.5 h-3.5 stroke-[1.5]" />*/}
                <span>{displayedResume.email}</span>
              </div>
            </div>
          </div>

          {/* Professional Experience Section */}
          <div className="mb-2">
            <h2 className="section-title text-sm sm:text-[15px] font-bold border-b border-gray-300 pb-1 mb-1">
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-2">
              {displayedResume.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="company-date flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <div>
                      <h3 className="job-title font-bold text-sm sm:text-[14px]">
                        {exp.title}
                      </h3>
                      <div className="text-sm sm:text-[14px]">{exp.company}</div>
                    </div>
                    <div className="text-sm sm:text-[14px] text-gray-600 dark:text-gray-400">
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <ul className="mt-0.5 space-y-0.5 text-sm sm:text-[14px]">
                    {exp.description
                      .split('\n')
                      .filter((point) => point.trim())
                      .map((point, idx) => (
                        <li
                          key={idx}
                          className="relative pl-2 before:content-['•'] before:absolute before:left-0 before:top-0"
                        >
                          {point.trim().replace(/^[•-]\s*/, '')}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          {displayedResume.projects.length > 0 && (
            <div className="mb-2">
              <h2 className="section-title text-sm sm:text-[15px] font-bold border-b border-gray-300 pb-1 mb-1">
                PROJECTS
              </h2>
              <div className="space-y-1">
                {displayedResume.projects.map((project, index) => (
                  <div key={index} className="experience-item">
                    <div className="company-date flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                      <h3 className="job-title font-bold text-sm sm:text-[14px]">
                        {project.name}
                      </h3>
                      {project.date && (
                        <div className="text-sm sm:text-[14px] text-gray-600 dark:text-gray-400">{project.date}</div>
                      )}
                    </div>
                    <ul className="mt-0.5 text-sm sm:text-[14px]">
                      {project.description.split('\n').map((point, idx) => (
                        <li
                          key={idx}
                          className="relative pl-2 before:content-['•'] before:absolute before:left-0 before:top-0"
                        >
                          {point.trim().replace(/^[•-]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          <div className="mb-2">
            <h2 className="section-title text-sm sm:text-[15px] font-bold border-b border-gray-300 pb-1 mb-1">
              EDUCATION
            </h2>
            <div className="space-y-1">
              {displayedResume.education.map((edu, index) => (
                <div key={index} className="experience-item">
                  <div className="company-date flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <div>
                      <div className="job-title font-bold text-sm sm:text-[14px]">
                        {edu.school}
                      </div>
                      <div className="text-sm sm:text-[14px]">
                        {edu.degree}
                        {edu.major && ` in ${edu.major}`}
                      </div>
                    </div>
                    <div className="text-sm sm:text-[14px] text-gray-600 dark:text-gray-400">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Other Section */}
          <div>
            <h2 className="section-title text-sm sm:text-[15px] font-bold border-b border-gray-300 pb-1 mb-1">
              SKILLS & OTHER
            </h2>
            <div className="skills-list space-y-1">
              {displayedResume.skillCategories?.map((category, index) => (
                <div key={index} className="text-sm sm:text-[14px]">
                  <span className="font-bold">{category.name}:</span>{' '}
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
