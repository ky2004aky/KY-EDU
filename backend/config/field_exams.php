<?php
$now = date('Y-m-d H:i:s');
return [
    // 1. 12th Science (PCM) / Defense
    [
        'title' => 'National Defence Academy & Naval Academy Examination (NDA)',
        'shortName' => 'UPSC NDA (10+2)',
        'conductingBody' => 'Union Public Service Commission (UPSC)',
        'category' => 'Defense',
        'stream' => 'Science (PCM) / 12th Pass',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 404,
        'posts' => ['Army Wing Cadet', 'Air Force Wing Cadet', 'Naval Academy Cadet (10+2 Cadet Entry)'],
        'eligibility' => [
            'minAge' => 16.5,
            'maxAge' => 19.5,
            'education' => '12th Class Pass of 10+2 pattern (Army Wing) OR 12th Class pass with Physics, Chemistry and Maths (Air Force and Navy)',
            'educationLevel' => '12th',
            'attempts' => 'No limit till age ceiling (16.5 - 19.5 years)',
            'ageRelaxation' => []
        ],
        'salary' => [
            'payLevel' => 'Level 10 (Lieutenant / Flying Officer / Sub-Lt)',
            'payScale' => '₹56,100 - ₹1,77,500',
            'inHandEstimate' => '₹85,000 / month + Military Service Pay (MSP ₹15,500) + Free Ration & Accommodation',
            'perks' => ['Defence Officers Mess Accommodation', 'Free Military Medical (Command Hospitals)', 'Subsidized CSD Canteen', 'Lifelong Prestige']
        ],
        'stages' => [
            ['stage' => 'Stage 1: Written Examination', 'type' => 'OMR Objective (Maths 300 + GAT 600)', 'marks' => '900 Marks', 'negativeMarking' => '1/3rd deduction'],
            ['stage' => 'Stage 2: SSB 5-Day Interview', 'type' => 'Psychological Tests, Group Tasks (GTO) & Personal Interview', 'marks' => '900 Marks', 'negativeMarking' => 'None']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'Mathematics (Class 11 & 12)',
                'weightage' => '300 Marks (120 Questions)',
                'keyTopics' => ['Trigonometry & Heights/Distances', 'Differential Calculus & Integration', 'Matrices & Determinants', 'Coordinate Geometry & 3D', 'Probability & Statistics'],
                'recommendedBooks' => [
                    ['title' => 'Mathematics for NDA & NA', 'author' => 'Dr. R.S. Aggarwal', 'type' => 'Core Bible'],
                    ['title' => 'NCERT Mathematics Class 11 & 12', 'author' => 'NCERT', 'type' => 'Foundation']
                ],
                'prepStrategy' => 'Master calculus, trigonometry, and vectors. Solve 10 years NDA previous year papers.'
            ],
            [
                'subjectName' => 'General Ability Test (GAT)',
                'weightage' => '600 Marks (English 200 + General Knowledge 400)',
                'keyTopics' => ['English Grammar & Vocabulary', 'Physics & Chemistry (10th/12th level)', 'Indian History & Geography', 'Current Affairs & Defence Updates'],
                'recommendedBooks' => [
                    ['title' => 'Pathfinder for NDA & NA', 'author' => 'Arihant Experts', 'type' => 'All-in-One Manual'],
                    ['title' => 'Word Power Made Easy', 'author' => 'Norman Lewis', 'type' => 'English Vocabulary']
                ],
                'prepStrategy' => 'Focus on basic NCERT science fundamentals and daily newspaper headlines.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-04-12', 'event' => 'NDA I Written Examination Conducted nationwide', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 2. 12th Pass Any Stream (SSC CHSL)
    [
        'title' => 'SSC Combined Higher Secondary Level Examination (CHSL 10+2)',
        'shortName' => 'SSC CHSL (10+2)',
        'conductingBody' => 'Staff Selection Commission (SSC)',
        'category' => 'SSC',
        'stream' => 'Any Stream (Arts / Commerce / Science)',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 4500,
        'posts' => ['Lower Division Clerk (LDC)', 'Junior Secretariat Assistant (JSA)', 'Data Entry Operator (DEO)'],
        'eligibility' => [
            'minAge' => 18,
            'maxAge' => 27,
            'education' => 'Must have passed 12th Standard or equivalent examination from a recognized Board or University',
            'educationLevel' => '12th',
            'attempts' => 'No limit till age ceiling',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 10]
            ]
        ],
        'salary' => [
            'payLevel' => 'Level 2 (₹19,900 - ₹63,200) to Level 4 (₹25,500 - ₹81,100)',
            'payScale' => '₹19,900 - ₹81,100 (7th CPC)',
            'inHandEstimate' => '₹36,000 - ₹44,000 / month in Metro Cities (X Category)',
            'perks' => ['Central Govt Medical Card (CGHS)', 'House Rent Allowance (HRA 30%)', 'DA + Transport Allowance']
        ],
        'stages' => [
            ['stage' => 'Tier 1: Computer Based Examination', 'type' => 'CBT MCQ (100 Questions)', 'marks' => '200 Marks (Q.A, English, Reasoning, G.A)', 'negativeMarking' => '0.50 marks per wrong answer'],
            ['stage' => 'Tier 2: Mathematical + English + Typing Test', 'type' => 'CBT Objective + Data Entry Skill Test', 'marks' => '360 Marks + Typing Qualifying', 'negativeMarking' => '1 mark deduction']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'Quantitative Aptitude (Arithmetic & Advanced)',
                'weightage' => '25% in Tier 1 & Sectional in Tier 2',
                'keyTopics' => ['Percentage, Profit & Loss, Ratio', 'Time & Work, Speed & Distance', 'Algebra & Geometry Theorems', 'Trigonometry & Mensuration 2D/3D'],
                'recommendedBooks' => [
                    ['title' => 'Quantitative Aptitude for Competitive Examinations', 'author' => 'Dr. R.S. Aggarwal', 'type' => 'Foundational Practice'],
                    ['title' => 'Fast Track Objective Arithmetic', 'author' => 'Rajesh Verma', 'type' => 'Shortcuts Manual']
                ],
                'prepStrategy' => 'Practice 30 arithmetic calculations daily. Learn cube roots, squares up to 50, and tables up to 30.'
            ],
            [
                'subjectName' => 'English Language & Comprehension',
                'weightage' => '25% in Tier 1 & 135 Marks in Tier 2',
                'keyTopics' => ['Spotting the Error & Fill in Blanks', 'Synonyms, Antonyms & Spelling Rules', 'Idioms & Phrases, One Word Substitution', 'Cloze Test & Reading Passages'],
                'recommendedBooks' => [
                    ['title' => 'Objective General English', 'author' => 'S.P. Bakshi', 'type' => 'Grammar Rules Bible'],
                    ['title' => 'English for General Competitions', 'author' => 'Neetu Singh (KD Campus)', 'type' => 'Hindi-English Bilingual']
                ],
                'prepStrategy' => 'Memorize 20 new vocabulary words and 10 idioms daily.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-05-15', 'event' => 'Tier 1 Computer Based Exam Schedule', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 3. 10th Pass Matriculation (SSC MTS)
    [
        'title' => 'SSC Multi-Tasking (Non-Technical) Staff & Havaldar Examination',
        'shortName' => 'SSC MTS (10th Pass)',
        'conductingBody' => 'Staff Selection Commission (SSC)',
        'category' => 'SSC',
        'stream' => 'Any Stream (Matriculation)',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 8326,
        'posts' => ['Multi-Tasking Staff (MTS)', 'Havaldar in CBIC & CBN (Customs & Narcotics)'],
        'eligibility' => [
            'minAge' => 18,
            'maxAge' => 27,
            'education' => 'Must have passed Matriculation (10th Class) Examination from a recognized Board',
            'educationLevel' => '10th',
            'attempts' => 'No limit till age ceiling',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 10]
            ]
        ],
        'salary' => [
            'payLevel' => 'Level 1 (7th CPC Matrix)',
            'payScale' => '₹18,000 - ₹56,900 (Grade Pay ₹1,800)',
            'inHandEstimate' => '₹29,000 - ₹34,000 / month in X Cities',
            'perks' => ['Stable Central Government Employment', 'CGHS Medical Care', 'Paid Leave & Pension Fund']
        ],
        'stages' => [
            ['stage' => 'Session 1: Numerical & Reasoning', 'type' => 'Computer Based MCQ (Qualifying, No Negative Marking)', 'marks' => '120 Marks', 'negativeMarking' => 'None'],
            ['stage' => 'Session 2: General Awareness & English', 'type' => 'Computer Based MCQ (Decides Final Merit List)', 'marks' => '150 Marks (50 Questions)', 'negativeMarking' => '1 mark deduction per mistake']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'General Awareness & Static GK',
                'weightage' => '50% of Merit Rank (75 Marks)',
                'keyTopics' => ['Indian Geography, Rivers & National Parks', 'Constitution of India, Fundamental Rights', 'Indian History & Freedom Struggle', 'Sports, Awards & Scientific Inventions'],
                'recommendedBooks' => [
                    ['title' => 'Lucent General Knowledge', 'author' => 'Lucent Publication', 'type' => 'Must-Read Bible'],
                    ['title' => 'Speedy Samanya Gyan', 'author' => 'Speedy Publication', 'type' => 'Railway & SSC Static']
                ],
                'prepStrategy' => 'Read Lucent GK 30 minutes every morning. Revise static facts and awards.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-06-20', 'event' => 'Session 1 & 2 Computer Based Exam', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 4. 10th Pass / ITI (Railway Group D)
    [
        'title' => 'RRC Railway Group D Level-1 Recruitment',
        'shortName' => 'RRC Group D (10th/ITI)',
        'conductingBody' => 'Railway Recruitment Cell (RRC / Indian Railways)',
        'category' => 'Railways',
        'stream' => 'Vocational / ITI Trades',
        'featured' => true,
        'status' => 'Upcoming',
        'vacancies' => 32450,
        'posts' => ['Track Maintainer Grade IV', 'Assistant Pointsman', 'Helper / Workshop Maintainer'],
        'eligibility' => [
            'minAge' => 18,
            'maxAge' => 33,
            'education' => '10th Pass (Matriculation) from recognized Board OR National Apprenticeship Certificate (NAC) granted by NCVT / ITI',
            'educationLevel' => '10th',
            'attempts' => 'No limit till age ceiling',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 10]
            ]
        ],
        'salary' => [
            'payLevel' => 'Level 1 (7th CPC)',
            'payScale' => '₹18,000 - ₹56,900',
            'inHandEstimate' => '₹26,000 - ₹32,000 / month + Railway Travel Pass for Family',
            'perks' => ['Complimentary Free Railway Passes', 'Railway Hospital Card', 'Night Duty Allowance']
        ],
        'stages' => [
            ['stage' => 'Stage 1: Computer Based Test (CBT)', 'type' => '100 Questions (Science 25, Maths 25, Reasoning 30, GA 20)', 'marks' => '100 Marks', 'negativeMarking' => '1/3rd mark deduction'],
            ['stage' => 'Stage 2: Physical Efficiency Test (PET)', 'type' => 'Qualifying (Run 1000m in 4 min 15 sec + Lift 35kg weight)', 'marks' => 'Qualifying', 'negativeMarking' => 'None']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'General Science (Physics, Chemistry, Life Sciences)',
                'weightage' => '25% of Exam (25 Questions)',
                'keyTopics' => ['Motion, Force & Work/Energy', 'Chemical Reactions & Acids/Bases', 'Human Anatomy, Cell Biology & Diseases', 'Electricity & Magnetism'],
                'recommendedBooks' => [
                    ['title' => 'Railway Samanya Vigyan (General Science)', 'author' => 'Speedy Publication', 'type' => 'Top PYQ Book'],
                    ['title' => 'NCERT Science Class 9 & 10', 'author' => 'NCERT', 'type' => 'Core Foundation']
                ],
                'prepStrategy' => 'Thoroughly solve all previous 5 years questions of RRB Group D science.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-07-10', 'event' => 'Notification & Application Window Announcement', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 5. Commerce & Banking (IBPS / SBI PO)
    [
        'title' => 'IBPS / SBI Probationary Officer Examination (Banking PO)',
        'shortName' => 'IBPS / SBI PO',
        'conductingBody' => 'Institute of Banking Personnel Selection & State Bank of India',
        'category' => 'Banking',
        'stream' => 'Commerce & Finance',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 6450,
        'posts' => ['Probationary Officer (PO)', 'Management Trainee (Junior Management Grade Scale I)'],
        'eligibility' => [
            'minAge' => 20,
            'maxAge' => 30,
            'education' => 'A Degree (Graduation) in any discipline from a recognized University. Ideal for Commerce, Economics, Banking, and all graduates.',
            'educationLevel' => 'Graduate',
            'attempts' => 'General: 4 attempts for SBI | Unlimited for IBPS',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 10]
            ]
        ],
        'salary' => [
            'payLevel' => 'Scale I Officer (JMGS-I)',
            'payScale' => '₹48,480 - ₹85,920 (12th Bipartite Settlement)',
            'inHandEstimate' => '₹62,000 - ₹72,000 / month + Bank Leased Quarters (₹25,000 - ₹35,000/mo) + Petrol Allowance',
            'perks' => ['Bank Leased Official Apartment', '50-60 Litres Free Petrol per month', 'Newspaper & Furniture Allowance', 'Concessional Home Loan at 4-5%']
        ],
        'stages' => [
            ['stage' => 'Phase 1: Preliminary Exam', 'type' => 'Objective Online Test (English 30, Quant 35, Reasoning 35)', 'marks' => '100 Marks (60 Minutes with Sectional Timers)', 'negativeMarking' => '0.25 marks deduction'],
            ['stage' => 'Phase 2: Main Examination + Descriptive', 'type' => 'Objective 200 Marks + Essay/Letter 25 Marks', 'marks' => '225 Marks (3.5 Hours)', 'negativeMarking' => '0.25 marks deduction'],
            ['stage' => 'Phase 3: Group Exercise & Personal Interview', 'type' => 'Panel Interview with Senior Bankers', 'marks' => '50 Marks', 'negativeMarking' => 'None']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'Data Analysis & Interpretation (Quant)',
                'weightage' => '35 Marks Prelims + 60 Marks Mains',
                'keyTopics' => ['Caselet DI & Radar Charts', 'Missing Data Interpretation & Probability', 'Arithmetic DI (Time/Work, Pipes, Profit)', 'Quadratic Inequalities & Number Series'],
                'recommendedBooks' => [
                    ['title' => 'Quantum CAT', 'author' => 'Sarvesh K. Verma', 'type' => 'Advanced DI Reference'],
                    ['title' => 'Quantitative Aptitude for Banking Examinations', 'author' => 'Adda247 Experts', 'type' => 'Banking Special']
                ],
                'prepStrategy' => 'Solve at least 4 complex Data Interpretation sets daily with timer.'
            ],
            [
                'subjectName' => 'Banking Awareness & Financial Current Affairs',
                'weightage' => '40-50 Marks in Mains Exam',
                'keyTopics' => ['RBI Monetary Policy, Repo Rate & CRR/SLR', 'NPA Management, IBC Code & Basel III Norms', 'Financial Inclusion, PMJDY, UPI & Digital Rupee', 'Budget & Economic Survey Highlights'],
                'recommendedBooks' => [
                    ['title' => 'Banking Awareness', 'author' => 'Arihant Experts', 'type' => 'Concepts Guide'],
                    ['title' => 'AffairsCloud Daily Current Affairs', 'author' => 'AffairsCloud', 'type' => 'Monthly Banking Capsule']
                ],
                'prepStrategy' => 'Read financial express / economic times and revise last 6 months banking news capsules.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-08-15', 'event' => 'Preliminary Online Examination', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 6. Commerce & Finance / Law (SEBI Grade A)
    [
        'title' => 'SEBI Grade A Assistant Manager Recruitment (Finance, Legal & IT)',
        'shortName' => 'SEBI Grade A (Finance/Law)',
        'conductingBody' => 'Securities and Exchange Board of India (SEBI)',
        'category' => 'Banking',
        'stream' => 'Commerce & Finance',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 152,
        'posts' => ['Assistant Manager (General Stream)', 'Assistant Manager (Legal)', 'Assistant Manager (Information Technology)'],
        'eligibility' => [
            'minAge' => 21,
            'maxAge' => 30,
            'education' => 'Master\'s Degree in Commerce / Economics / MBA Finance OR Bachelor\'s Degree in Law (LL.B) OR Bachelor\'s in Engineering OR CA / CFA / CS',
            'educationLevel' => 'Graduate',
            'attempts' => 'No limit till age ceiling',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 10]
            ]
        ],
        'salary' => [
            'payLevel' => 'Grade A Officer',
            'payScale' => '₹44,500 - ₹89,150 (Gross ₹1,49,000/month without accommodation)',
            'inHandEstimate' => '₹1,15,000 - ₹1,35,000 / month + SEBI Officers Colony Bandra Kurla Complex (BKC Mumbai)',
            'perks' => ['Accomodation in prime Mumbai (BKC / Prabhadevi)', 'Medical Expenses 100% reimbursed', 'Book Grant & Laptop Allowance', 'Subsidized Education for children']
        ],
        'stages' => [
            ['stage' => 'Phase 1: Online Examination', 'type' => 'Paper 1 (GA, Quant, Reasoning, English) + Paper 2 (Commerce, Accounts, Finance, Mgmt)', 'marks' => '200 Marks (Cut-off Qualifying)', 'negativeMarking' => '0.25 marks deduction'],
            ['stage' => 'Phase 2: Online Exam + Descriptive', 'type' => 'Paper 1 English Descriptive (100) + Paper 2 Core Finance/Law (100)', 'marks' => '200 Marks (Determines Shortlist)', 'negativeMarking' => '0.25 marks deduction'],
            ['stage' => 'Phase 3: Interview', 'type' => 'In-person Board Interview at SEBI Bhavan, Mumbai', 'marks' => '15% weightage', 'negativeMarking' => 'None']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'Commerce, Accountancy & Financial Management',
                'weightage' => '50% in Phase 1 & Phase 2',
                'keyTopics' => ['Accounting Standards, Cash Flow & Balance Sheet', 'Financial Markets: Primary & Secondary Markets, SEBI Act', 'Corporate Governance & Companies Act 2013', 'Costing: Marginal Costing, Standard Costing & Budgetary Control'],
                'recommendedBooks' => [
                    ['title' => 'Financial Management', 'author' => 'Prasanna Chandra', 'type' => 'Standard Reference'],
                    ['title' => 'Indian Financial System', 'author' => 'M.Y. Khan', 'type' => 'Financial Markets Guide']
                ],
                'prepStrategy' => 'Understand SEBI regulations, derivatives, IPO norms, and corporate valuation principles.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-07-25', 'event' => 'Phase 1 Online Examination Schedule', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 7. Teaching & Education (CTET)
    [
        'title' => 'Central Teacher Eligibility Test (CTET / Central Schools)',
        'shortName' => 'CTET (B.Ed / D.El.Ed)',
        'conductingBody' => 'Central Board of Secondary Education (CBSE / NCTE)',
        'category' => 'Teaching',
        'stream' => 'Arts & Humanities',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 25000,
        'posts' => ['Primary Teacher (PRT - Class 1 to 5)', 'Trained Graduate Teacher (TGT - Class 6 to 8)', 'KVS / NVS / DSSSB Teacher Eligibility'],
        'eligibility' => [
            'minAge' => 18,
            'maxAge' => 45,
            'education' => 'Senior Secondary (12th) with 50% + 2-Year D.El.Ed (Paper I) OR Graduation with 50% + B.Ed (Bachelor of Education) for Paper II',
            'educationLevel' => '12th',
            'attempts' => 'No limit (Certificate Valid for Lifetime)',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 10]
            ]
        ],
        'salary' => [
            'payLevel' => 'PRT (Level 6: ₹35,400) | TGT (Level 7: ₹44,900) | PGT (Level 8: ₹47,600)',
            'payScale' => '₹35,400 - ₹1,51,100 (7th CPC)',
            'inHandEstimate' => '₹48,000 - ₹68,000 / month in Central Kendriya Vidyalaya (KVS) & Navodaya (NVS)',
            'perks' => ['Campus Staff Quarters in School', 'Summer Vacation 50 Days Paid Leave', 'Subsidized Education for 2 children']
        ],
        'stages' => [
            ['stage' => 'Paper I: Primary Teacher (Class 1-5)', 'type' => 'Child Development, Language I & II, Maths, Environmental Studies', 'marks' => '150 Marks (90 to Qualify for Gen, 82 for Reserved)', 'negativeMarking' => 'None'],
            ['stage' => 'Paper II: Elementary (Class 6-8)', 'type' => 'Child Development, Language I & II, Mathematics & Science OR Social Studies', 'marks' => '150 Marks (No Negative Marking)', 'negativeMarking' => 'None']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'Child Development & Pedagogy (CDP)',
                'weightage' => '30 Questions (30 Marks) in both papers',
                'keyTopics' => ['Piaget, Kohlberg & Vygotsky Theories', 'Concept of Inclusive Education & Children with Special Needs', 'Learning & Motivation, Constructivist Paradigm', 'Evaluation & Continuous Assessment (CCE)'],
                'recommendedBooks' => [
                    ['title' => 'Child Development and Pedagogy', 'author' => 'Himanshi Singh (Let\'s LEARN)', 'type' => 'Top Popular Guide'],
                    ['title' => 'CTET & TETs Child Development and Pedagogy', 'author' => 'Arihant Experts', 'type' => 'PYQ Practice']
                ],
                'prepStrategy' => 'Understand child psychology concepts rather than rote learning. Solve last 8 CTET papers.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-07-05', 'event' => 'CTET National Examination', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 8. State Civil Services (State PSC / PCS)
    [
        'title' => 'State Combined Civil Services Examination (State PCS / SDM / DSP)',
        'shortName' => 'State PSC (PCS)',
        'conductingBody' => 'State Public Service Commission (UPPSC / BPSC / MPPSC / RAS)',
        'category' => 'State PSC',
        'stream' => 'Arts & Humanities',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 1120,
        'posts' => ['Sub-Divisional Magistrate (SDM)', 'Deputy Superintendent of Police (DSP)', 'Assistant Commissioner Commercial Tax', 'Block Development Officer (BDO)'],
        'eligibility' => [
            'minAge' => 21,
            'maxAge' => 40,
            'education' => 'Bachelor\'s Degree in any discipline from a recognized University in India',
            'educationLevel' => 'Graduate',
            'attempts' => 'No limit till age ceiling (40 years for Gen, 43 for OBC, 45 for SC/ST in UP/MP/Bihar)',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 15]
            ]
        ],
        'salary' => [
            'payLevel' => 'Pay Level 10 (Pay Band ₹15,600 - ₹39,100 + Grade Pay ₹5,400)',
            'payScale' => '₹56,100 - ₹1,77,500 (7th CPC)',
            'inHandEstimate' => '₹72,000 - ₹82,000 / month + Official Sub-Divisional Bungalow + Armed Security Escort',
            'perks' => ['Official Residence in Tehsil / Sub-Division', 'Government Vehicle with Driver', 'Armed Police Guard Escort', 'Direct Administrative Magistracy Powers']
        ],
        'stages' => [
            ['stage' => 'Stage 1: Preliminary Exam', 'type' => 'General Studies 1 (200 Marks) + CSAT Qualifying (33%)', 'marks' => '400 Marks', 'negativeMarking' => '1/3rd deduction'],
            ['stage' => 'Stage 2: Mains Examination', 'type' => '8 Descriptive Papers (General Hindi, Essay, GS Papers 1 to 6 including State Special)', 'marks' => '1500 Marks', 'negativeMarking' => 'None'],
            ['stage' => 'Stage 3: Personality Test', 'type' => 'Interview before State Commission Board', 'marks' => '100 Marks', 'negativeMarking' => 'None']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'State Special History, Geography & Economy',
                'weightage' => 'GS Papers 5 & 6 in Mains + 20-25 Questions in Prelims',
                'keyTopics' => ['History, Culture & Tribal Heritage of the State', 'State Geography, Rivers, Agriculture & Soil Zones', 'State Budget, Economic Schemes & Welfare Policies', 'Panchayati Raj & State Administrative Structure'],
                'recommendedBooks' => [
                    ['title' => 'State Specific Comprehensive Manual (Drishti IAS State Special)', 'author' => 'Drishti IAS', 'type' => 'State Reference'],
                    ['title' => 'Ghatna Chakra State GS Pointer', 'author' => 'Samanya Adhyayan Chakra', 'type' => 'Previous Year Solved']
                ],
                'prepStrategy' => 'Dedicate 30% preparation time to state-specific geography, budget, census data, and local culture.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-06-14', 'event' => 'State PCS Prelims Examination', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 9. State Police Constable (12th Pass)
    [
        'title' => 'State Police Constable & Sub-Inspector Recruitment',
        'shortName' => 'State Police (12th/Grad)',
        'conductingBody' => 'State Police Recruitment & Promotion Board',
        'category' => 'State PSC',
        'stream' => 'Any Stream',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 60244,
        'posts' => ['Civil Police Constable', 'PAC Constable (Provincial Armed Constabulary)', 'Fireman & Sub-Inspector (SI)'],
        'eligibility' => [
            'minAge' => 18,
            'maxAge' => 25,
            'education' => '12th Class (10+2 Intermediate) pass from recognized Board (for Constable) OR Graduation in any stream (for Sub-Inspector)',
            'educationLevel' => '12th',
            'attempts' => 'No limit till age ceiling',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 5],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 0]
            ]
        ],
        'salary' => [
            'payLevel' => 'Level 3 (Constable: ₹21,700) | Level 6 (Sub-Inspector: ₹35,400)',
            'payScale' => '₹21,700 - ₹1,12,400',
            'inHandEstimate' => '₹34,000 - ₹38,000 / month (Constable) | ₹52,000 / month (SI) + Uniform Allowance',
            'perks' => ['Government Police Housing', '13-Month Salary Provision for Police Personnel', 'Free State Medical Care']
        ],
        'stages' => [
            ['stage' => 'Stage 1: Written OMR Exam', 'type' => '150 Questions (General Knowledge, Hindi, Numerical & Mental Ability)', 'marks' => '300 Marks (2 Hours)', 'negativeMarking' => '0.50 marks per error'],
            ['stage' => 'Stage 2: Physical Standard & Endurance Test', 'type' => 'Height 168 cm (Male) / 152 cm (Female) + Run 4.8 km in 25 minutes', 'marks' => 'Qualifying', 'negativeMarking' => 'None']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'Samanya Hindi (General Hindi)',
                'weightage' => '37 Questions (74 Marks)',
                'keyTopics' => ['Varnamala, Sandhi, Samas', 'Paryayvachi, Vilom, Tatsam/Tadbhav', 'Ras, Chhand, Alankar', 'Prasiddha Kavi, Lekhak Evam Rachnayein'],
                'recommendedBooks' => [
                    ['title' => 'Samanya Hindi', 'author' => 'Dr. Vasudev Nandan Prasad', 'type' => 'Grammar Bible'],
                    ['title' => 'Aditya Publication Samanya Hindi', 'author' => 'Aditya Experts', 'type' => 'Objective Practice']
                ],
                'prepStrategy' => 'Hindi is the highest scoring section in state police exams. Solve 50 grammar questions daily.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-08-20', 'event' => 'Physical Efficiency Test Schedule', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 10. Pharmacy & Paramedical (ESIC Pharmacist)
    [
        'title' => 'ESIC & Railway Pharmacist Allopathic Recruitment',
        'shortName' => 'ESIC Pharmacist',
        'conductingBody' => 'Employees\' State Insurance Corporation & Railway Recruitment Board',
        'category' => 'Medical',
        'stream' => 'Medical & Nursing',
        'featured' => false,
        'status' => 'Active',
        'vacancies' => 1250,
        'posts' => ['Pharmacist (Allopathic)', 'Senior Pharmacist in Central ESIC Hospitals'],
        'eligibility' => [
            'minAge' => 18,
            'maxAge' => 32,
            'education' => 'Degree in Pharmacy (B.Pharma) OR Diploma in Pharmacy (D.Pharma) from recognized institute + Registration as Pharmacist under Pharmacy Act 1948',
            'educationLevel' => 'Diploma',
            'attempts' => 'No limit till age ceiling',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 10]
            ]
        ],
        'salary' => [
            'payLevel' => 'Level 5 (7th CPC)',
            'payScale' => '₹29,200 - ₹92,300',
            'inHandEstimate' => '₹43,000 - ₹48,000 / month in ESIC Model Hospitals',
            'perks' => ['ESIC Central Medical Healthcare', 'HRA & Transport Allowance', 'Shift Duty & Dispensing Allowances']
        ],
        'stages' => [
            ['stage' => 'Single Stage Computer Based Test (CBT)', 'type' => 'Technical Pharmacy Subject (50 Qs / 100 Marks) + General Aptitude (50 Qs / 50 Marks)', 'marks' => '150 Marks (120 Minutes)', 'negativeMarking' => '0.25 marks deduction']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'Pharmacy Subject Domain',
                'weightage' => '100 Marks (67% of Merit)',
                'keyTopics' => ['Pharmaceutics & Dosage Forms', 'Pharmacology & Toxicology: Drug Mechanisms', 'Pharmaceutical Chemistry & Quality Analysis', 'Pharmacognosy: Herbal Drugs & Plant Phytochemicals', 'Hospital & Clinical Pharmacy, Drug Interactions'],
                'recommendedBooks' => [
                    ['title' => 'Comprehensive Pharmacy Review', 'author' => 'Leon Shargel', 'type' => 'International Reference'],
                    ['title' => 'Review of Pharmacy (GPAT / Pharmacist Exam)', 'author' => 'Piyush Tripathi / Inamdar', 'type' => 'Pharmacist Exam Special']
                ],
                'prepStrategy' => 'Master drug classifications, adverse effects, and hospital dispensing regulations.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-09-05', 'event' => 'CBT Online Test Across India', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ],

    // 11. Computer Science & IT (ISRO Scientist 'SC')
    [
        'title' => 'ISRO Scientist / Engineer \'SC\' (Computer Science & Information Technology)',
        'shortName' => 'ISRO Scientist (CS/IT)',
        'conductingBody' => 'Indian Space Research Organisation (ISRO Centralised Recruitment Board)',
        'category' => 'Engineering/PSU',
        'stream' => 'Engineering / Technology',
        'featured' => true,
        'status' => 'Active',
        'vacancies' => 350,
        'posts' => ['Scientist / Engineer \'SC\' (Computer Science)', 'Satellite Software Development Engineer'],
        'eligibility' => [
            'minAge' => 21,
            'maxAge' => 30,
            'education' => 'B.E / B.Tech or equivalent in Computer Science / Information Technology with First Class (minimum 65% marks or 6.84 CGPA)',
            'educationLevel' => 'B.Tech',
            'attempts' => 'No limit till age ceiling',
            'ageRelaxation' => [
                ['category' => 'OBC', 'relaxationYears' => 3],
                ['category' => 'SC/ST', 'relaxationYears' => 5],
                ['category' => 'PwD', 'relaxationYears' => 10]
            ]
        ],
        'salary' => [
            'payLevel' => 'Level 10 (Gazetted Scientific Post)',
            'payScale' => '₹56,100 - ₹1,77,500',
            'inHandEstimate' => '₹88,000 / month + ISRO Space Research Special Allowance + Housing in ISRO Space Colony',
            'perks' => ['Residential Quarters in ISRO Space Center (Bangalore/Trivandrum/Sriharikota)', 'CHSS Space Health Scheme for family', 'Opportunity to work on Gaganyaan & Lunar Missions']
        ],
        'stages' => [
            ['stage' => 'Stage 1: Written Examination', 'type' => 'Part A Core Computer Science (80 Marks) + Part B Aptitude (20 Marks)', 'marks' => '100 Marks', 'negativeMarking' => '0.33 marks deduction'],
            ['stage' => 'Stage 2: Technical Interview', 'type' => 'Pure Technical Viva with Senior Space Scientists', 'marks' => '100 Marks (Must score 60% to Qualify)', 'negativeMarking' => 'None']
        ],
        'subjectDetails' => [
            [
                'subjectName' => 'Computer Science & Software Architecture',
                'weightage' => '80% of Written Exam + 100% of Technical Interview',
                'keyTopics' => ['Algorithms, Data Structures & Complexity (Big-O)', 'Operating Systems, Deadlocks & Memory Virtualization', 'Database Systems, SQL & Normalization', 'Computer Networks: TCP/IP, Cryptography & Routing', 'Compiler Design & Theory of Computation'],
                'recommendedBooks' => [
                    ['title' => 'Introduction to Algorithms', 'author' => 'Cormen, Leiserson, Rivest, Stein (CLRS)', 'type' => 'Algorithms Bible'],
                    ['title' => 'Operating System Concepts', 'author' => 'Silberschatz, Galvin, Gagne', 'type' => 'OS Master']
                ],
                'prepStrategy' => 'Solve GATE Computer Science previous year question papers from 2005 to 2025.'
            ]
        ],
        'timeline' => [
            ['date' => '2026-09-20', 'event' => 'Written Examination in 12 Major Cities', 'status' => 'Upcoming']
        ],
        'createdAt' => $now,
        'updatedAt' => $now
    ]
];
