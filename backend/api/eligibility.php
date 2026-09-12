<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Exam.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\getJsonInput;
use App\Models\Exam;

initCors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed. Use GET or POST.'], 405);
}

$input = $_SERVER['REQUEST_METHOD'] === 'POST' ? getJsonInput() : $_GET;
$age = (int)($input['age'] ?? 21);
$rawEdu = trim($input['educationLevel'] ?? $input['education'] ?? 'Graduate');
$rawStream = trim($input['stream'] ?? 'Any');
$rawCategory = trim($input['category'] ?? 'General');
$minMarks = isset($input['minMarks']) ? (int)$input['minMarks'] : 0;
$isAppearing = !empty($input['isAppearing']);

/**
 * Normalize educational qualification into a structured profile
 */
function normalizeEducationProfile(string $edu, string $stream): array {
    $e = strtolower($edu);
    $s = strtolower($stream);

    $level = 'graduate';
    $streamType = 'general';
    $isTechnical = false;
    $hasIti = false;
    $hasDiploma = false;
    $hasDegree = false;
    $discipline = 'general';

    if (str_contains($e, '10th') || str_contains($e, 'matric')) {
        $level = '10th';
    } elseif (str_contains($e, '12th') || str_contains($e, 'intermediate') || str_contains($e, 'senior secondary')) {
        $level = '12th';
        if (str_contains($e, 'pcm') || str_contains($s, 'pcm')) {
            $streamType = 'science_pcm';
            $discipline = 'science';
        } elseif (str_contains($e, 'pcb') || str_contains($s, 'pcb')) {
            $streamType = 'science_pcb';
            $discipline = 'medical';
        } elseif (str_contains($e, 'commerce') || str_contains($s, 'commerce')) {
            $streamType = 'commerce';
            $discipline = 'commerce';
        } elseif (str_contains($e, 'arts') || str_contains($s, 'arts')) {
            $streamType = 'arts';
            $discipline = 'arts';
        }
    } elseif (str_contains($e, 'iti') || str_contains($s, 'iti')) {
        $level = 'iti';
        $hasIti = true;
        $isTechnical = true;
        $discipline = 'technical_trade';
    } elseif (str_contains($e, 'diploma') || str_contains($e, 'polytechnic') || str_contains($s, 'diploma') || str_contains($s, 'polytechnic')) {
        $level = 'diploma';
        $hasDiploma = true;
        $isTechnical = true;
        $discipline = 'engineering';
    } elseif (str_contains($e, 'b.tech') || str_contains($e, 'b.e') || str_contains($e, 'engineering') || str_contains($s, 'engineering') || str_contains($s, 'b.tech')) {
        $level = 'graduate';
        $hasDegree = true;
        $isTechnical = true;
        $discipline = 'engineering';
        $streamType = 'engineering';
    } elseif (str_contains($e, 'agri') || str_contains($s, 'agri')) {
        $level = 'graduate';
        $hasDegree = true;
        $discipline = 'agriculture';
        $streamType = 'agriculture';
    } elseif (str_contains($e, 'nursing') || str_contains($e, 'gnm') || str_contains($e, 'medical') || str_contains($s, 'nursing') || str_contains($s, 'medical')) {
        $level = 'graduate';
        $hasDegree = true;
        $discipline = 'medical_nursing';
        $streamType = 'medical';
    } elseif (str_contains($e, 'law') || str_contains($e, 'll.b') || str_contains($s, 'law') || str_contains($s, 'll.b')) {
        $level = 'graduate';
        $hasDegree = true;
        $discipline = 'law';
        $streamType = 'law';
    } elseif (str_contains($e, 'post graduate') || str_contains($e, 'master') || str_contains($e, 'm.tech') || str_contains($e, 'm.sc') || str_contains($e, 'mba')) {
        $level = 'post_graduate';
        $hasDegree = true;
    } else {
        // General Graduate (B.A, B.Sc, B.Com, etc.)
        $level = 'graduate';
        $hasDegree = true;
        if (str_contains($s, 'commerce')) $discipline = 'commerce';
        elseif (str_contains($s, 'pcm') || str_contains($s, 'science')) $discipline = 'science';
        elseif (str_contains($s, 'arts')) $discipline = 'arts';
    }

    return [
        'level' => $level,
        'streamType' => $streamType,
        'discipline' => $discipline,
        'isTechnical' => $isTechnical,
        'hasIti' => $hasIti,
        'hasDiploma' => $hasDiploma,
        'hasDegree' => $hasDegree,
        'rawEdu' => $edu,
        'rawStream' => $stream
    ];
}

$userProfile = normalizeEducationProfile($rawEdu, $rawStream);

$examModel = new Exam();
$allExams = $examModel->getAll();

$results = [];

foreach ($allExams as $exam) {
    $elig = $exam['eligibility'] ?? [];
    $examTitle = $exam['title'] ?? 'Exam';
    $shortName = $exam['shortName'] ?? $examTitle;
    $minAge = (int)($elig['minAge'] ?? 18);
    $maxAgeBase = (int)($elig['maxAge'] ?? 32);

    // 1. AGE EVALUATION WITH RESERVATION CATEGORY
    $relaxation = 0;
    $cleanCategory = strtoupper($rawCategory);

    if (str_contains($cleanCategory, 'OBC')) {
        $relaxation = 3;
    } elseif (str_contains($cleanCategory, 'SC') || str_contains($cleanCategory, 'ST')) {
        $relaxation = 5;
    } elseif (str_contains($cleanCategory, 'PWD') && str_contains($cleanCategory, 'SC')) {
        $relaxation = 15;
    } elseif (str_contains($cleanCategory, 'PWD') && str_contains($cleanCategory, 'OBC')) {
        $relaxation = 13;
    } elseif (str_contains($cleanCategory, 'PWD')) {
        $relaxation = 10;
    } elseif (str_contains($cleanCategory, 'EX-SERVICEMEN') || str_contains($cleanCategory, 'EX')) {
        $relaxation = 5;
    }

    $effectiveMaxAge = $maxAgeBase + $relaxation;
    $isAgeEligible = ($age >= $minAge && $age <= $effectiveMaxAge);

    if ($age < $minAge) {
        $yearsToWait = $minAge - $age;
        $ageVerdict = "Underage: Need {$yearsToWait} more year" . ($yearsToWait > 1 ? 's' : '') . " to reach minimum age ({$minAge} yrs)";
    } elseif ($age > $effectiveMaxAge) {
        $yearsOver = $age - $effectiveMaxAge;
        $ageVerdict = "Overage by {$yearsOver} year" . ($yearsOver > 1 ? 's' : '') . " (Maximum age for {$rawCategory} is {$effectiveMaxAge} yrs)";
    } else {
        $yearsRemaining = $effectiveMaxAge - $age;
        $ageVerdict = "Age Criteria Met: Eligible for application ({$yearsRemaining} attempt year" . ($yearsRemaining > 1 ? 's' : '') . " remaining until age {$effectiveMaxAge})";
    }

    // 2. EDUCATION & STREAM EVALUATION
    $examEduReq = strtolower($elig['educationLevel'] ?? 'graduate');
    $examEduText = strtolower($elig['education'] ?? '');
    $examStream = strtolower($exam['stream'] ?? 'any stream');

    $isEduEligible = false;
    $isStreamEligible = false;
    $eduVerdict = '';
    $streamVerdict = '';
    $acceptedQualifications = [];
    $minMarksRule = 'Passing marks (No minimum aggregate percentage required for General/Reserved)';
    $openSchoolValid = 'Yes (NIOS / IGNOU and recognized open boards are 100% valid)';
    $finalYearAllowed = 'Yes (Candidates appearing in final semester/year may apply conditionally)';

    // Check specialized exams first
    $isLawExam = str_contains($examEduReq, 'law') || str_contains($examEduReq, 'll.b') || str_contains($examStream, 'law') || str_contains($examEduText, 'bar council') || str_contains($examEduText, 'laws');
    $isAgriExam = str_contains($examEduReq, 'agri') || str_contains($examStream, 'agri') || str_contains($examEduText, 'agriculture');
    $isNursingExam = str_contains($examEduReq, 'nursing') || str_contains($examEduReq, 'gnm') || str_contains($examStream, 'nursing') || str_contains($examEduText, 'nursing');
    $isPolytechnicExam = (str_contains($examEduReq, 'polytechnic') || str_contains($examEduText, 'diploma in civil') || str_contains($examEduText, 'diploma in mechanical')) && !str_contains($examEduReq, 'iti');
    $isItiExam = str_contains($examEduReq, 'iti') || str_contains($examEduText, 'iti');

    // Rule 1: Law & Judicial Services (State PCS-J, Judiciary)
    if ($isLawExam) {
        $acceptedQualifications = [
            "Bachelor of Laws (LL.B 3-Year Professional Course)",
            "Integrated 5-Year Law Degree (B.A. LL.B / B.B.A. LL.B / B.Com. LL.B)",
            "Bar Council of India (BCI) recognized institution or University"
        ];

        if ($userProfile['discipline'] === 'law' || str_contains(strtolower($userProfile['rawEdu']), 'law') || str_contains(strtolower($userProfile['rawStream']), 'law') || str_contains(strtolower($userProfile['rawEdu']), 'll.b')) {
            $isEduEligible = true;
            $eduVerdict = "Qualification Met: Professional LL.B Law Degree satisfies State Judicial Services Civil Judge eligibility.";
            $isStreamEligible = true;
            $streamVerdict = "Stream Compatible: Legal Studies & Bar Council accredited degree matched.";
        } else {
            $isEduEligible = false;
            $eduVerdict = "Qualification Gap: Strictly requires Professional Law Degree (LL.B). You selected " . $userProfile['rawEdu'] . ".";
            $isStreamEligible = false;
            $streamVerdict = "Requires Law (LL.B / B.A. LL.B) Stream.";
        }
    }

    // Rule 2: Agriculture & Allied Disciplines (IBPS SO AFO)
    elseif ($isAgriExam) {
        $acceptedQualifications = [
            "4-Year B.Sc (Hons.) Agriculture or B.Sc Horticulture",
            "B.Sc Dairy Science / Fisheries / Forestry / Food Technology / Agricultural Engineering",
            "Recognized state/central ICAR accredited agriculture university"
        ];

        if ($userProfile['discipline'] === 'agriculture' || str_contains(strtolower($userProfile['rawEdu']), 'agri') || str_contains(strtolower($userProfile['rawStream']), 'agri')) {
            $isEduEligible = true;
            $eduVerdict = "Qualification Met: 4-Year B.Sc Agriculture credential qualifies you for Agriculture Field Officer.";
            $isStreamEligible = true;
            $streamVerdict = "Stream Compatible: Agriculture & Allied Sciences discipline matched.";
        } else {
            $isEduEligible = false;
            $eduVerdict = "Qualification Gap: Requires 4-Year B.Sc in Agriculture / Allied Science. You selected " . $userProfile['rawEdu'] . ".";
            $isStreamEligible = false;
            $streamVerdict = "Requires Agriculture / Allied Sciences Stream.";
        }
    }

    // Rule 3: Medical & Nursing Exams (AIIMS NORCET)
    elseif ($isNursingExam) {
        $acceptedQualifications = [
            "B.Sc (Hons.) Nursing / B.Sc Nursing from Indian Nursing Council (INC) recognized institute",
            "Diploma in General Nursing and Midwifery (GNM) with 2 years clinical hospital experience",
            "Registered as Nurse & Midwife with State / Indian Nursing Council"
        ];

        if ($userProfile['discipline'] === 'medical_nursing' || str_contains(strtolower($userProfile['rawEdu']), 'nursing') || str_contains(strtolower($userProfile['rawStream']), 'nursing') || str_contains(strtolower($userProfile['rawStream']), 'medical')) {
            $isEduEligible = true;
            $eduVerdict = "Qualification Met: B.Sc Nursing or GNM qualification meets AIIMS Nursing Officer specifications.";
            $isStreamEligible = true;
            $streamVerdict = "Stream Compatible: Healthcare & Nursing discipline matched.";
        } else {
            $isEduEligible = false;
            $eduVerdict = "Qualification Gap: Requires B.Sc Nursing or GNM Diploma recognized by INC. You selected " . $userProfile['rawEdu'] . ".";
            $isStreamEligible = false;
            $streamVerdict = "Requires Nursing / Medical Sciences stream.";
        }
    }

    // Rule 4: Polytechnic Diploma / Junior Engineer Exams (SSC JE)
    elseif ($isPolytechnicExam) {
        $acceptedQualifications = [
            "3-Year Polytechnic Diploma in Civil, Mechanical, or Electrical Engineering",
            "Degree in Engineering (B.Tech / B.E) in Civil, Mechanical, or Electrical disciplines"
        ];

        if ($userProfile['hasDiploma'] || ($userProfile['discipline'] === 'engineering') || str_contains(strtolower($userProfile['rawEdu']), 'polytechnic') || str_contains(strtolower($userProfile['rawEdu']), 'b.tech')) {
            $isEduEligible = true;
            $eduVerdict = "Qualification Met: Your Engineering Diploma / B.Tech degree satisfies the Junior Engineer criteria.";
            $isStreamEligible = true;
            $streamVerdict = "Stream Compatible: Technical Engineering stream matched.";
        } else {
            $isEduEligible = false;
            $eduVerdict = "Qualification Gap: Requires 3-Year Polytechnic Diploma OR B.Tech in Engineering. You selected " . $userProfile['rawEdu'] . ".";
            $isStreamEligible = false;
            $streamVerdict = "Requires Technical Engineering Diploma or Degree.";
        }
    }

    // Rule 5: Technical ITI / Railway ALP Exams (RRB ALP, Technicians)
    elseif ($isItiExam) {
        $acceptedQualifications = [
            "10th Pass (Matriculation) PLUS ITI in approved trade (Fitter, Electrician, Welder, Machinist, Wireman)",
            "3-Year Polytechnic Diploma in Mechanical / Electrical / Electronics / Automobile Engineering",
            "B.Tech / B.E Degree in Engineering disciplines"
        ];

        if ($userProfile['hasIti'] || $userProfile['hasDiploma'] || ($userProfile['discipline'] === 'engineering') || str_contains(strtolower($userProfile['rawEdu']), 'iti') || str_contains(strtolower($userProfile['rawEdu']), 'polytechnic') || str_contains(strtolower($userProfile['rawEdu']), 'b.tech')) {
            $isEduEligible = true;
            $eduVerdict = "Qualification Met: Technical credential (ITI / Diploma / B.Tech) meets Railway technical criteria.";
            $isStreamEligible = true;
            $streamVerdict = "Stream Compatible: Engineering / Trade discipline matched.";
        } elseif ($userProfile['level'] === '10th') {
            $isEduEligible = true;
            $eduVerdict = "Conditionally Eligible: 10th Pass candidate must hold ITI trade certificate in designated railway craft.";
            $isStreamEligible = true;
            $streamVerdict = "Stream Compatible: Requires ITI trade completion.";
        } else {
            $isEduEligible = false;
            $eduVerdict = "Qualification Gap: Requires 10th + ITI Trade Certificate OR 3-Year Engineering Diploma OR B.Tech. You selected " . $userProfile['rawEdu'] . ".";
            $isStreamEligible = false;
            $streamVerdict = "Requires Technical Trade or Engineering Stream.";
        }
    }

    // Rule 6: General Graduate Exams (UPSC CSE, SSC CGL, CDS, NIMCET, Banking)
    else {
        $acceptedQualifications = [
            "Bachelor's Degree in Any Discipline (B.A, B.Sc, B.Com, B.Tech, B.E, B.A LL.B, MBBS, B.Sc Agri)",
            "Distance Education / Open University Degrees (IGNOU, State Open Universities)",
            "Final Year / Final Semester Appearing Candidates"
        ];
        
        if ($userProfile['hasDegree'] || $userProfile['level'] === 'post_graduate') {
            $isEduEligible = true;
            $eduVerdict = "Qualification Met: Your graduation degree satisfies the minimum Graduate requirement.";
        } else {
            $isEduEligible = false;
            $eduVerdict = "Qualification Gap: Requires Bachelor's Degree. Your selected qualification is " . $userProfile['rawEdu'] . ".";
        }

        // Stream check for General Graduate
        if ($examStream === 'any stream' || str_contains($examStream, 'any') || empty($examStream)) {
            $isStreamEligible = true;
            $streamVerdict = "Stream Compatible: Open to candidates from All Academic Streams.";
        } else {
            $isStreamEligible = true;
            $streamVerdict = "Stream Compatible: Any stream accepted.";
        }
    }

    // 3. OVERALL ELIGIBILITY & MATCH SCORE
    $isFullyEligible = $isAgeEligible && $isEduEligible && $isStreamEligible;

    $score = 0;
    if ($isAgeEligible) $score += 40;
    if ($isEduEligible) $score += 40;
    if ($isStreamEligible) $score += 20;

    $results[] = [
        'exam' => $exam,
        'isEligible' => $isFullyEligible,
        'matchScore' => $score,
        // Age Evaluation Details
        'ageCriteria' => [
            'minAge' => $minAge,
            'maxAgeBase' => $maxAgeBase,
            'relaxationYears' => $relaxation,
            'effectiveMaxAge' => $effectiveMaxAge,
            'userAge' => $age,
            'category' => $rawCategory,
            'isAgeEligible' => $isAgeEligible,
            'verdict' => $ageVerdict
        ],
        // Education Evaluation Details (Rich Education Breakdown)
        'eduCriteria' => [
            'isEduEligible' => $isEduEligible,
            'verdict' => $eduVerdict,
            'minQualification' => $exam['eligibility']['education'] ?? $exam['eligibility']['educationLevel'] ?? 'Graduation',
            'acceptedQualifications' => $acceptedQualifications,
            'minMarksRule' => $minMarksRule,
            'openSchoolValid' => $openSchoolValid,
            'finalYearAllowed' => $finalYearAllowed,
            'userSelectedEdu' => $rawEdu
        ],
        // Stream Evaluation Details
        'streamCriteria' => [
            'isStreamEligible' => $isStreamEligible,
            'examStream' => $exam['stream'] ?? 'Any Stream',
            'verdict' => $streamVerdict,
            'userStream' => $rawStream
        ],
        // Legacy flat fields for backwards UI compatibility
        'effectiveMaxAge' => $effectiveMaxAge,
        'ageRelaxationApplied' => $relaxation,
        'ageStatus' => $ageVerdict,
        'eduStatus' => $eduVerdict,
        'streamStatus' => $streamVerdict
    ];
}

// Sort by: Eligible First, then Match Score DESC, then Total Vacancies DESC
usort($results, function($a, $b) {
    if ($a['isEligible'] !== $b['isEligible']) {
        return $b['isEligible'] <=> $a['isEligible'];
    }
    if ($a['matchScore'] !== $b['matchScore']) {
        return $b['matchScore'] <=> $a['matchScore'];
    }
    $vacA = (int)preg_replace('/[^0-9]/', '', (string)($a['exam']['vacancies'] ?? '0'));
    $vacB = (int)preg_replace('/[^0-9]/', '', (string)($b['exam']['vacancies'] ?? '0'));
    return $vacB <=> $vacA;
});

$eligibleCount = count(array_filter($results, fn($r) => $r['isEligible']));

jsonResponse([
    'success' => true,
    'query' => [
        'age' => $age,
        'educationLevel' => $rawEdu,
        'stream' => $rawStream,
        'category' => $rawCategory,
        'normalized' => $userProfile
    ],
    'totalExamsAnalyzed' => count($results),
    'eligibleCount' => $eligibleCount,
    'results' => $results
]);
