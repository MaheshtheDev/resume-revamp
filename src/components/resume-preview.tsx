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
        <div className="p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold dark:text-white">
            {showPreviousVersion ? 'Previous Version' : 'Current Version'}
          </h2>
          <div className="flex items-center gap-2">
            {previousVersion && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVersion}
                className="flex items-center gap-1"
              >
                <History className="w-4 h-4" />
                <span>
                  {showPreviousVersion ? 'Show Current' : 'Show Previous'}
                </span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
            </Button>
          </div>
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto ${hideControls ? 'pt-10' : 'p-4'}`}
      >
        <div
          ref={resumeRef}
          className="bg-white mx-auto max-w-[816px] p-8"
          style={{ minHeight: '1056px' }}
        >
          {/* Header Section */}
          <div className="text-center mb-2">
            <h1 className="text-[28px] font-bold mb-1">
              {displayedResume.name}
            </h1>
            <div className="contact-info flex items-center justify-center text-[13px] leading-none">
              <div className="flex items-center">
                {/*<MapPin className="w-3.5 h-3.5 stroke-[1.5]" />*/}
                <span>{displayedResume.location}</span>
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                {/*<Phone className="w-3.5 h-3.5 stroke-[1.5]" />*/}
                <span>{displayedResume.phone}</span>
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                {/*<Mail className="w-3.5 h-3.5 stroke-[1.5]" />*/}
                <span>{displayedResume.email}</span>
              </div>
            </div>
          </div>

          {/* Professional Experience Section */}
          <div className="mb-2">
            <h2 className="section-title text-[15px] font-bold border-b border-gray-300 pb-1 mb-1">
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-2">
              {displayedResume.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="company-date flex justify-between items-baseline">
                    <div>
                      <h3 className="job-title font-bold text-[14px]">
                        {exp.title}
                      </h3>
                      <div className="text-[14px]">{exp.company}</div>
                    </div>
                    <div className="text-[14px]">
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <ul className="mt-0.5 space-y-0.5 text-[14px]">
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
              <h2 className="section-title text-[15px] font-bold border-b border-gray-300 pb-1 mb-1">
                PROJECTS
              </h2>
              <div className="space-y-1">
                {displayedResume.projects.map((project, index) => (
                  <div key={index} className="experience-item">
                    <div className="company-date flex justify-between items-baseline">
                      <h3 className="job-title font-bold text-[14px]">
                        {project.name}
                      </h3>
                      {project.date && (
                        <div className="text-[14px]">{project.date}</div>
                      )}
                    </div>
                    <ul className="mt-0.5 text-[14px]">
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
            <h2 className="section-title text-[15px] font-bold border-b border-gray-300 pb-1 mb-1">
              EDUCATION
            </h2>
            <div className="space-y-1">
              {displayedResume.education.map((edu, index) => (
                <div key={index} className="experience-item">
                  <div className="company-date flex justify-between items-baseline">
                    <div>
                      <div className="job-title font-bold text-[14px]">
                        {edu.school}
                      </div>
                      <div className="text-[14px]">
                        {edu.degree}
                        {edu.major && ` in ${edu.major}`}
                      </div>
                    </div>
                    <div className="text-[14px]">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Other Section */}
          <div>
            <h2 className="section-title text-[15px] font-bold border-b border-gray-300 pb-1 mb-1">
              SKILLS & OTHER
            </h2>
            <div className="skills-list space-y-1">
              {displayedResume.skillCategories?.map((category, index) => (
                <div key={index} className="text-[14px]">
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
