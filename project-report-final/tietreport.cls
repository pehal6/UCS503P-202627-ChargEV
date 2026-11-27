\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{tietreport}[2026/09/08 TIET Custom Report Class]

% Inherit from the standard report class
\LoadClass[12pt,a4paper,oneside]{report}

% Essential packages
\RequirePackage[utf8]{inputenc}
\RequirePackage{geometry}
\geometry{a4paper, margin=1in}

% Chapter formatting to match the PDF
\RequirePackage{titlesec}
\titleformat{\chapter}[display]
  {\normalfont\huge\bfseries\raggedleft}
  {\chaptertitlename\ \thechapter}{20pt}{\Huge}[\vspace{1ex}\titlerule]

% Header and footer formatting
\RequirePackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\thepage \quad \@TitlePageHeader}
\renewcommand{\headrulewidth}{0.4pt}
\fancypagestyle{plain}{
  \fancyhf{}
  \fancyfoot[C]{}
  \renewcommand{\headrulewidth}{0pt}
}

% Define variables to hold the custom fields
\newcommand{\@TitlePageHeader}{}
\newcommand{\TitlePageHeader}[1]{\renewcommand{\@TitlePageHeader}{#1}}

\newcommand{\@ProjectTitle}{}
\newcommand{\ProjectTitle}[1]{\renewcommand{\@ProjectTitle}{#1}}

\newcommand{\@ProjectSubTitle}{}
\newcommand{\ProjectSubTitle}[1]{\renewcommand{\@ProjectSubTitle}{#1}}

\newcommand{\@TitlePageSubText}{}
\newcommand{\TitlePageSubText}[1]{\renewcommand{\@TitlePageSubText}{#1}}

\newcommand{\@AdvisorName}{}
\newcommand{\AdvisorName}[1]{\renewcommand{\@AdvisorName}{#1}}

\newcommand{\@TitlePageFooterText}{}
\newcommand{\TitlePageFooterText}[1]{\renewcommand{\@TitlePageFooterText}{#1}}

% Redefine \maketitle to format the custom title page
\renewcommand{\maketitle}{
    \begin{titlepage}
        \centering
        \vspace*{2cm}
        
        {\Large \textbf{\@TitlePageHeader}} \\
        \vspace{2.5cm}
        
        {\Huge \textbf{\@ProjectTitle}} \\
        \vspace{0.5cm}
        {\normalsize \@ProjectSubTitle} \\
        
        \vspace{3cm}
        
        {\large \textbf{Submitted by:}}\\
        \vspace{0.2cm}
        {\normalsize \@author} \\
        
        \vspace{1cm}
        
        {\normalsize \@TitlePageSubText} \\
        
        \vspace{2cm}
        
        {\large \textbf{Submitted to:}}\\
        \vspace{0.2cm}
        {\normalsize \@AdvisorName} \\
        
        \vfill
        
        {\normalsize \@TitlePageFooterText} \\
        \vspace*{1cm}
    \end{titlepage}
}
\endinput

