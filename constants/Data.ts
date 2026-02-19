export interface Exercise {
    id: string;
    name: string;
    category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Abs' | 'Cardio' | 'Full Body';
    muscles: string;
    description: string;
    benefits: string[];
    videoId?: string;
}

export const Exercises: Exercise[] = [
    // CHEST
    {
        id: 'chest_1',
        name: 'Bench Press',
        category: 'Chest',
        muscles: 'Pectoralis Major, Triceps, Anterior Deltoids',
        description: 'Lie on a flat bench. Grip the barbell slightly wider than shoulder-width. Lower the bar to your chest, then press it back up to the starting position.',
        benefits: ['Builds upper body strength', 'Increases pushing power', 'Compound movement for multiple muscle groups'],
        videoId: 'rT7DgCr-3pg'
    },
    {
        id: 'chest_2',
        name: 'Incline Dumbbell Press',
        category: 'Chest',
        muscles: 'Upper Pectorals, Anterior Deltoids, Triceps',
        description: 'Set an adjustable bench to a 30-45 degree incline. Press dumbbells upwards from chest level, converging them slightly at the top without touching.',
        benefits: ['Targets upper chest', 'Improves shoulder stability', 'Corrects muscle imbalances'],
        videoId: '8iPEnn-ltC8'
    },
    {
        id: 'chest_3',
        name: 'Push Up',
        category: 'Chest',
        muscles: 'Pectorals, Triceps, Core',
        description: 'Start in a plank position. Lower your body until your chest nearly touches the floor, then push back up. Keep your core tight throughout.',
        benefits: ['No equipment needed', 'Builds core stability', 'Great functional movement'],
        videoId: 'IODxDxX7oi4'
    },
    {
        id: 'chest_4',
        name: 'Cable Fly',
        category: 'Chest',
        muscles: 'Pectoralis Major',
        description: 'Stand between two pulleys set to chest height. Pull handles together in front of your chest with a slight bend in elbows, squeezing at the center.',
        benefits: ['Constant tension on muscles', 'Great for isolation', 'Improves chest definition'],
        videoId: 'Iwe6AmxVf7o'
    },

    // BACK
    {
        id: 'back_1',
        name: 'Deadlift',
        category: 'Back',
        muscles: 'Erector Spinae, Glutes, Hamstrings, Traps',
        description: 'Stand with feet hip-width apart. Hinge at hips to grip the bar. Drive through heels to stand up straight, keeping the bar close to your body.',
        benefits: ['Builds total body strength', 'Improves posture', 'Strengthens posterior chain'],
        videoId: 'op9kVnSso6Q'
    },
    {
        id: 'back_2',
        name: 'Pull Up',
        category: 'Back',
        muscles: 'Latissimus Dorsi, Biceps',
        description: 'Grip a pull-up bar with palms facing away. Pull your body up until your chin clears the bar, then lower back down with control.',
        benefits: ['Builds back width', 'Increases relative strength', 'Decompresses the spine'],
        videoId: 'eGo4IYlbE5g'
    },
    {
        id: 'back_3',
        name: 'Barbell Row',
        category: 'Back',
        muscles: 'Lats, Rhomboids, Rear Delts',
        description: 'Bend knees slightly and hinge forward at hips. Pull the barbell towards your lower chest/upper abs, squeezing your shoulder blades together.',
        benefits: ['Thickens the back', 'Improves pulling strength', 'Strengthens core stability'],
        videoId: '9efgcAjQe7E'
    },
    {
        id: 'back_4',
        name: 'Lat Pulldown',
        category: 'Back',
        muscles: 'Latissimus Dorsi, Biceps',
        description: 'Sit at a cable machine. Pull the wide bar down towards your upper chest, focusing on driving elbows down and back.',
        benefits: ['Beginner friendly alternative to pull-ups', 'Isolates lats effectively', 'Adjustable resistance'],
        videoId: 'CAwf7n6Luuc'
    },

    // LEGS
    {
        id: 'legs_1',
        name: 'Squat',
        category: 'Legs',
        muscles: 'Quadriceps, Glutes, Hamstrings, Core',
        description: 'Stand with feet shoulder-width apart. Lower hips down and back as if sitting in a chair, keeping chest up. Drive back up to standing.',
        benefits: ['King of leg exercises', 'Builds lower body power', 'Increases bone density'],
        videoId: 'elt7juvUJ4o' // Buff Dudes Squat
    },
    {
        id: 'legs_2',
        name: 'Lunges',
        category: 'Legs',
        muscles: 'Quadriceps, Glutes, Hamstrings',
        description: 'Step forward with one leg and lower hips until both knees are bent at 90 degrees. Push back to starting position.',
        benefits: ['Improves balance and coordination', 'Unilateral training', 'Functional movement pattern'],
        videoId: 'QOVaHwm-Q6U'
    },
    {
        id: 'legs_3',
        name: 'Leg Press',
        category: 'Legs',
        muscles: 'Quadriceps, Glutes',
        description: 'Sit in the machine and place feet on the platform. Push the weight away by extending knees, then slowly lower back down.',
        benefits: ['Safely loads heavy weight', 'Supports back', 'Great for hypertrophy'],
        videoId: 'IZxyjW7MPJQ'
    },
    {
        id: 'legs_4',
        name: 'Calf Raise',
        category: 'Legs',
        muscles: 'Gastrocnemius, Soleus',
        description: 'Stand on the edge of a step. Lower heels below the step level, then raise up onto toes as high as possible.',
        benefits: ['Strengthens ankles', 'Improves running performance', 'Aesthetics'],
        videoId: '-M4-G8p8fmc'
    },

    // SHOULDERS
    {
        id: 'shoulders_1',
        name: 'Overhead Press',
        category: 'Shoulders',
        muscles: 'Deltoids, Triceps',
        description: 'Stand with barbell at collarbone height. Press the weight straight up overhead until arms are locked out. Lower back down with control.',
        benefits: ['Builds shoulder mass', 'Improves core stability', 'Functional overhead strength'],
        videoId: '2yjwXTZQDDI'
    },
    {
        id: 'shoulders_2',
        name: 'Lateral Raise',
        category: 'Shoulders',
        muscles: 'Lateral Deltoids',
        description: 'Stand holding dumbbells at sides. Raise arms out to the sides until shoulder height, keeping a slight bend in elbows.',
        benefits: ['Widens the shoulders', 'Isolates side delts', 'Improves V-taper aesthetic'],
        videoId: '3VcKaXpzqRo'
    },
    {
        id: 'shoulders_3',
        name: 'Face Pull',
        category: 'Shoulders',
        muscles: 'Rear Deltoids, Rotator Cuff',
        description: 'Set a cable pulley to head height. Pull the rope towards your face, separating hands and squeezing rear shoulders.',
        benefits: ['Improves posture', 'Promotes shoulder health', 'Counteracts hunching'],
        videoId: 'rep-qVOkqgk' // Athlean-X Face Pull
    },

    // ARMS
    {
        id: 'arms_1',
        name: 'Barbell Curl',
        category: 'Arms',
        muscles: 'Biceps Brachii',
        description: 'Stand holding a barbell with underhand grip. Curl the weight up towards your shoulders, keeping elbows pinned to your sides.',
        benefits: ['Builds bicep mass', 'Simple and effective', 'Allows heavy loading'],
        videoId: 'kwG2ipFRgfo'
    },
    {
        id: 'arms_2',
        name: 'Tricep Dip',
        category: 'Arms',
        muscles: 'Triceps, Chest, Front Delts',
        description: 'Support yourself on parallel bars. Lower body by bending elbows until upper arms are parallel to floor, then push back up.',
        benefits: ['Compound movement for arms', 'Builds significant mass', 'Functional pressing strength'],
        videoId: '2z8JmcrW-As'
    },
    {
        id: 'arms_3',
        name: 'Hammer Curl',
        category: 'Arms',
        muscles: 'Brachialis, Forearms',
        description: 'Hold dumbbells with neutral grip (palms facing each other). Curl weights up keeping palms facing each other throughout.',
        benefits: ['Targets outer arm', 'Improves grip strength', 'Thickens arm appearance'],
        videoId: 'zC3nLlEvin4'
    },

    // ABS / CORE
    {
        id: 'abs_1',
        name: 'Plank',
        category: 'Abs',
        muscles: 'Transverse Abdominis, Core',
        description: 'Hold a push-up position on your forearms. Keep body in a straight line from head to heels. Hold for time.',
        benefits: ['Builds endurance', 'Strengthens deep core', 'Protects lower back'],
        videoId: 'pSHjTRCQxIw'
    },
    {
        id: 'abs_2',
        name: 'Crunch',
        category: 'Abs',
        muscles: 'Rectus Abdominis',
        description: 'Lie on back with knees bent. Curl shoulders towards knees, squeezing abs at the top. Lower slowly.',
        benefits: ['Isolates "six-pack" muscles', 'Simple to perform', 'Low impact'],
        videoId: 'Xyd_fa5zoEU'
    },

    // CARDIO
    {
        id: 'cardio_1',
        name: 'Running',
        category: 'Cardio',
        muscles: 'Legs, Heart',
        description: 'Move at a steady pace faster than a walk. Maintain good posture and rhythmic breathing.',
        benefits: ['Improves cardiovascular health', 'Burns calories', 'Builds leg endurance'],
        videoId: '_kGESn8ArrU'
    },
    {
        id: 'cardio_2',
        name: 'Jump Rope',
        category: 'Cardio',
        muscles: 'Calves, Shoulders, Heart',
        description: 'Swing the rope around your body and jump over it with each revolution. Stay on the balls of your feet.',
        benefits: ['High calorie burn', 'Improves coordination', 'Portable workout'],
        videoId: 'u3zgHI8QnqE'
    }
];
