import { PlanetData, ChemicalItem, BuoyancyItem, Badge } from '../types';

export const PLANETS: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sun',
    vietnameseName: 'Mặt Trời Kỳ Diệu',
    emoji: '☀️',
    color: '#F59E0B',
    textColor: '#78350F',
    accentBg: '#FEF3C7',
    radiusKm: 696340,
    gravityMps2: 274,
    orbitPeriodDays: 0,
    distanceFromSunMillionKm: 0,
    funFact: 'Mặt Trời to đến mức có thể chứa hơn 1,3 triệu Trái Đất bên trong!',
    details: 'Là một quả cầu plasma khổng lồ, phát ra ánh sáng và nhiệt sưởi ấm toàn bộ Hệ Mặt Trời.',
    atmosphere: 'Hydro (73%) và Heli (25%)',
    moonsCount: 0,
    quizQuestion: {
      question: 'Mặt Trời là loại thiên thể nào trong vũ trụ?',
      options: ['Một hành tinh đá', 'Một ngôi sao khổng lồ', 'Một tiểu hành tinh'],
      correctIndex: 1,
      explanation: 'Chính xác! Mặt Trời là một ngôi sao dạng sao lùn vàng trung tâm của Thái Dương Hệ.'
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    vietnameseName: 'Trái Đất Xanh Tươi',
    emoji: '🌍',
    color: '#0284C7',
    textColor: '#075985',
    accentBg: '#E0F2FE',
    radiusKm: 6371,
    gravityMps2: 9.8,
    orbitPeriodDays: 365.25,
    distanceFromSunMillionKm: 149.6,
    funFact: 'Hơn 71% bề mặt Trái Đất được bao phủ bởi đại dương nước xanh mát lành.',
    details: 'Hành tinh duy nhất được biết đến hiện nay nuôi dưỡng sự sống phong phú, có bầu khí quyển bảo vệ.',
    atmosphere: 'Nitơ (78%), Oxy (21%) và khí Argon',
    moonsCount: 1,
    quizQuestion: {
      question: 'Trái Đất mất bao lâu để quay hết 1 vòng quanh Mặt Trời?',
      options: ['1 tháng', '365 ngày (1 năm)', '100 ngày'],
      correctIndex: 1,
      explanation: 'Tuyệt vời! Trái Đất quay 1 vòng quanh Mặt Trời mất 365,25 ngày, tương đương một năm Trái Đất.'
    }
  },
  {
    id: 'moon',
    name: 'Moon',
    vietnameseName: 'Mặt Trăng Thân Thiện',
    emoji: '🌕',
    color: '#64748B',
    textColor: '#1E293B',
    accentBg: '#F1F5F9',
    radiusKm: 1737,
    gravityMps2: 1.62,
    orbitPeriodDays: 27.3,
    distanceFromSunMillionKm: 149.6,
    funFact: 'Trọng lực Mặt Trăng chỉ bằng 1/6 Trái Đất! Nhảy một cái bạn sẽ bay cao tận 3 mét!',
    details: 'Vệ tinh tự nhiên duy nhất của Trái Đất, điều hòa thủy triều biển và phản chiếu ánh sáng Mặt Trời về đêm.',
    atmosphere: 'Hầu như không có khí quyển (chân không)',
    moonsCount: 0,
    quizQuestion: {
      question: 'Nếu bạn nặng 30kg trên Trái Đất, lên Mặt Trăng bạn sẽ cân nặng khoảng bao nhiêu?',
      options: ['Chỉ khoảng 5kg', 'Vẫn 30kg', 'Nặng 60kg'],
      correctIndex: 0,
      explanation: 'Đúng rồi! Trọng lực Mặt Trăng yếu hơn 6 lần nên bạn sẽ nhẹ như bông và nhảy cực kỳ cao!'
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    vietnameseName: 'Sao Hỏa Đỏ Rực',
    emoji: '🪐',
    color: '#EF4444',
    textColor: '#991B1B',
    accentBg: '#FEE2E2',
    radiusKm: 3389,
    gravityMps2: 3.72,
    orbitPeriodDays: 687,
    distanceFromSunMillionKm: 227.9,
    funFact: 'Sao Hỏa có ngọn núi lửa Olympus Mons cao gấp 3 lần đỉnh Everest trên Trái Đất!',
    details: 'Hành tinh màu đỏ cam đặc trưng do bề mặt chứa rất nhiều oxit sắt (gỉ sét). Các robot thám hiểm đang tìm dấu vết nước cổ đại.',
    atmosphere: 'Carbon dioxide (95%), Nitơ và Argon',
    moonsCount: 2,
    quizQuestion: {
      question: 'Tại sao Sao Hỏa lại có màu đỏ cam đặc trưng?',
      options: ['Vì có rất nhiều nham thạch nóng', 'Vì bề mặt phủ đầy gỉ oxit sắt', 'Vì ánh sáng đèn pin'],
      correctIndex: 1,
      explanation: 'Rất thông minh! Bụi oxit sắt gỉ sét bao phủ toàn bộ bề mặt tạo nên biệt danh Hành tinh Đỏ.'
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    vietnameseName: 'Sao Mộc Hùng Vĩ',
    emoji: '🌪️',
    color: '#D97706',
    textColor: '#92400E',
    accentBg: '#FEF3C7',
    radiusKm: 69911,
    gravityMps2: 24.79,
    orbitPeriodDays: 4333,
    distanceFromSunMillionKm: 778.5,
    funFact: 'Sao Mộc là người anh cả khổng lồ: nó to hơn tất cả các hành tinh khác cộng lại!',
    details: 'Là một hành tinh khí khổng lồ với Vết Đỏ Lớn – một cơn bão xoáy đã kéo dài hơn 300 năm.',
    atmosphere: 'Khí Hydro (90%) và Heli (10%)',
    moonsCount: 95,
    quizQuestion: {
      question: 'Vết Đỏ Lớn trên Sao Mộc thực chất là gì?',
      options: ['Một hồ nước màu đỏ', 'Một cơn bão xoáy khổng lồ', 'Một hố thiên thạch'],
      correctIndex: 1,
      explanation: 'Chuẩn xác! Đó là một siêu bão xoáy khổng lồ to hơn cả hành tinh Trái Đất của chúng ta!'
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    vietnameseName: 'Sao Thổ Đeo Nhẫn',
    emoji: '🪐',
    color: '#CA8A04',
    textColor: '#854D0E',
    accentBg: '#FEF9C3',
    radiusKm: 58232,
    gravityMps2: 10.44,
    orbitPeriodDays: 10759,
    distanceFromSunMillionKm: 1434,
    funFact: 'Vành đai Sao Thổ lung linh tuyệt đẹp được làm từ hàng tỷ mảnh băng và đá lấp lánh!',
    details: 'Mặc dù cực kỳ khổng lồ, Sao Thổ nhẹ đến mức nếu có một bể nước đủ to, nó sẽ nổi bồng bềnh!',
    atmosphere: 'Khí Hydro và Heli',
    moonsCount: 146,
    quizQuestion: {
      question: 'Vành đai lấp lánh của Sao Thổ chủ yếu được cấu tạo từ gì?',
      options: ['Vàng và kim cương', 'Băng đá và bụi không gian', 'Kim loại nặng'],
      correctIndex: 1,
      explanation: 'Chính xác! Vành đai gồm vô số mảnh băng và đá phản chiếu ánh Mặt Trời lấp lánh như viên ngọc.'
    }
  }
];

export const CHEMICAL_ITEMS: ChemicalItem[] = [
  {
    id: 'lemon_acid',
    name: 'Axit Nước Chanh',
    formula: 'C6H8O7',
    color: '#FACC15',
    type: 'acid',
    ph: 2.2,
    description: 'Chua thanh, giàu ion H+, có khả năng tác dụng mạnh với muối kiềm tạo bọt khí.'
  },
  {
    id: 'baking_soda',
    name: 'Bột Baking Soda',
    formula: 'NaHCO3',
    color: '#F8FAFC',
    type: 'base',
    ph: 8.5,
    description: 'Bột Natri Bicacbonat trắng mịn, có tính bazo nhẹ, phản ứng sủi bọt với axit.'
  },
  {
    id: 'water',
    name: 'Nước Tinh Khiết',
    formula: 'H2O',
    color: '#38BDF8',
    type: 'water',
    ph: 7.0,
    description: 'Dung môi trung tính (pH = 7), nền tảng nuôi dưỡng sự sống.'
  },
  {
    id: 'cabbage_indicator',
    name: 'Thuốc Thử Bắp Cải Tím',
    formula: 'Anthocyanin',
    color: '#8B5CF6',
    type: 'indicator',
    ph: 7.0,
    description: 'Chất chỉ thị màu tự nhiên: Hóa ĐỎ trong axit, hóa XANH LÁ/VÀNG trong bazơ!'
  },
  {
    id: 'oil',
    name: 'Dầu Ăn Thực Vật',
    formula: 'Lipid (D < 1)',
    color: '#F59E0B',
    type: 'oil',
    ph: 6.8,
    description: 'Nhẹ hơn nước (khối lượng riêng 0.92 g/cm3), kỵ nước nên nổi thành lớp bên trên.'
  },
  {
    id: 'soap',
    name: 'Xà Phòng Kỳ Diệu',
    formula: 'Surfactant',
    color: '#EC4899',
    type: 'soap',
    ph: 9.0,
    description: 'Chất hoạt động bề mặt: có 1 đầu ưa nước và 1 đầu ưa dầu, giúp hòa tan dầu vào nước!'
  }
];

export const BUOYANCY_ITEMS: BuoyancyItem[] = [
  {
    id: 'balloon',
    name: 'Bóng Bay Heli',
    density: 0.18,
    volume: 500,
    mass: 90,
    icon: '🎈',
    color: '#FB7185',
    funFact: 'Khối lượng riêng cực nhỏ (0.18 g/cm³) giúp bóng bay nổi phập phồng trên mặt nước!',
    submergedYPercent: 12
  },
  {
    id: 'apple',
    name: 'Quả Táo Giòn',
    density: 0.84,
    volume: 180,
    mass: 151,
    icon: '🍎',
    color: '#EF4444',
    funFact: 'Táo chứa khoảng 25% không khí bên trong thịt quả, nên nổi lập lờ tựa chiếc phao!',
    submergedYPercent: 84
  },
  {
    id: 'wood_block',
    name: 'Khối Gỗ Sồi',
    density: 0.65,
    volume: 300,
    mass: 195,
    icon: '🪵',
    color: '#B45309',
    funFact: 'Gỗ sồi có thớ rỗng, lực đẩy Ác-si-mét lớn hơn trọng lượng nên nổi vững vàng.',
    submergedYPercent: 65
  },
  {
    id: 'gold_bar',
    name: 'Thỏi Vàng Thật',
    density: 19.3,
    volume: 80,
    mass: 1544,
    icon: '🪙',
    color: '#EAB308',
    funFact: 'Vàng siêu nặng (19.3 g/cm³)! Trọng lực kéo nó chìm ngay xuống đáy bể tức thì.',
    submergedYPercent: 96
  },
  {
    id: 'submarine',
    name: 'Tàu Ngầm Mini',
    density: 0.95, // adjustable in app
    volume: 400,
    mass: 380,
    icon: '🚢',
    color: '#3B82F6',
    funFact: 'Tàu ngầm có khoang nước (ballast): bơm nước vào để chìm, xả khí nén ra để nổi lên!',
    submergedYPercent: 55
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'astronomer',
    title: 'Nhà Thiên Văn Nhí',
    desc: 'Khám phá tất cả các hành tinh và trả lời đúng câu hỏi vũ trụ',
    icon: '🔭',
    category: 'space',
    unlocked: false
  },
  {
    id: 'rocket_pilot',
    title: 'Phi Hành Gia Quả Cảm',
    desc: 'Phóng tên lửa thử nghiệm thành công đạt độ cao trên 100km',
    icon: '🚀',
    category: 'space',
    unlocked: false
  },
  {
    id: 'alchemist',
    title: 'Phù Thủy Hóa Học',
    desc: 'Thực hiện phản ứng sủi bọt CO2 và đổi màu chỉ thị quỳ tím',
    icon: '🧪',
    category: 'science',
    unlocked: false
  },
  {
    id: 'archimedes_master',
    title: 'Bậc Thầy Ác-si-mét',
    desc: 'Thử nghiệm lực đẩy nổi với cả 5 vật thể trong bể nước',
    icon: '⚓',
    category: 'science',
    unlocked: false
  },
  {
    id: 'balance_sage',
    title: 'Chuyên Gia Cân Bằng',
    desc: 'Giải đúng 3 bài toán cân thăng bằng logic',
    icon: '⚖️',
    category: 'math',
    unlocked: false
  },
  {
    id: 'speed_math_hero',
    title: 'Tia Chớp Tính Nhẩm',
    desc: 'Đạt chuỗi trả lời đúng 5 câu liên tiếp trong thử thách toán học',
    icon: '⚡',
    category: 'math',
    unlocked: false
  },
  {
    id: 'mascot_stylist',
    title: 'Nhà Thiết Kế Mascot',
    desc: 'Tùy chỉnh trang phục và phụ kiện cho người bạn 3D',
    icon: '🎨',
    category: 'mascot',
    unlocked: true
  }
];

export const MASCOT_SPEECHES = [
  'Chào bạn nhỏ! Mình là Sparky, bạn đồng hành khoa học của bạn!',
  'Bạn có biết ánh sáng từ Mặt Trời mất 8 phút 20 giây để đến Trái Đất không?',
  'Hóa học giống như phép thuật vậy, trộn hai chất có thể sinh ra chất mới hoàn toàn!',
  'Toán học là ngôn ngữ kỳ diệu của vũ trụ, hãy cùng tính nhẩm thật vui nhé!',
  'Thử kéo con trượt trọng lực xem tên lửa bay cao đến đâu nào!'
];
