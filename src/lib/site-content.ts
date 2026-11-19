export const NAV_ITEMS = [
  { href: "/about", label: "장례식장 안내", key: "about" },
  { href: "/facilities", label: "시설안내", key: "facilities" },
  { href: "/guide", label: "이용안내", key: "guide" },
  { href: "/status", label: "빈소현황", key: "status" },
  { href: "/location", label: "오시는 길", key: "location" },
] as const;

export const FACILITIES = [
  {
    name: "101호(특실)",
    size: "약 330㎡ (100평)",
    desc: "넓은 접객실과 독립 휴게실을 갖춘 프리미엄 빈소",
    image:
      "https://readdy.ai/api/search-image?query=Elegant%20spacious%20Korean%20funeral%20memorial%20hall%20with%20white%20chrysanthemum%20altar%2C%20soft%20warm%20lighting%2C%20calm%20sage%20green%20and%20beige%20interior%2C%20clean%20modern%20architecture%20photography&width=800&height=600&seq=fac-01&orientation=landscape",
  },
  {
    name: "102호(일반실)",
    size: "약 165㎡ (50평)",
    desc: "유가족이 편안히 머무를 수 있는 단정한 빈소",
    image:
      "https://readdy.ai/api/search-image?query=Quiet%20modern%20Korean%20funeral%20reception%20room%20with%20neat%20tables%2C%20white%20flowers%2C%20soft%20natural%20light%2C%20muted%20green%20beige%20tones%2C%20serene%20interior%20architecture%20photography&width=800&height=600&seq=fac-02&orientation=landscape",
  },
  {
    name: "201호(VIP)",
    size: "약 330㎡ (100평)",
    desc: "독립 출입구와 전용 유족실을 갖춘 최상급 빈소",
    image:
      "https://readdy.ai/api/search-image?query=Calm%20clean%20bright%20ceremonial%20room%20with%20white%20lilies%20and%20soft%20diffused%20light%2C%20minimal%20respectful%20interior%2C%20sage%20green%20and%20ivory%20palette%2C%20serene%20architecture%20photography&width=800&height=600&seq=fac-03&orientation=landscape",
  },
  {
    name: "202호(특실)",
    size: "약 200㎡ (60평)",
    desc: "채광이 좋은 접객실과 샤워실을 갖춘 특실 빈소",
    image:
      "https://readdy.ai/api/search-image?query=Cozy%20calm%20family%20lounge%20room%20with%20soft%20sofa%2C%20warm%20lamp%20light%2C%20wooden%20floor%2C%20ivory%20and%20sage%20green%20tones%2C%20peaceful%20minimal%20interior%20photography&width=800&height=600&seq=fac-04&orientation=landscape",
  },
  {
    name: "입관실",
    size: "유가족 참관 가능",
    desc: "고인을 정성으로 씻기고 관에 모시는 정갈한 전용실",
    image:
      "https://readdy.ai/api/search-image?query=Clean%20minimal%20ceremonial%20preparation%20room%20with%20plain%20white%20walls%2C%20soft%20indirect%20lighting%2C%20folded%20white%20linen%20on%20a%20wooden%20table%2C%20quiet%20respectful%20atmosphere%2C%20muted%20ivory%20and%20sage%20green%20tones%2C%20interior%20photography&width=800&height=600&seq=fac-05&orientation=landscape",
  },
  {
    name: "안치실",
    size: "위생 냉장시설 완비",
    desc: "고인을 정중히 모시는 청결한 안치 전용 공간",
    image:
      "https://readdy.ai/api/search-image?query=Serene%20clean%20chamber%20room%20with%20polished%20pale%20stone%20walls%2C%20soft%20even%20lighting%2C%20minimal%20stainless%20steel%20details%2C%20calm%20respectful%20atmosphere%2C%20light%20grey%20and%20sage%20green%20tones%2C%20interior%20photography&width=800&height=600&seq=fac-06&orientation=landscape",
  },
  {
    name: "샤워실",
    size: "24시간 이용 가능",
    desc: "장례 기간 동안 씻고 정돈할 수 있는 위생 공간",
    image:
      "https://readdy.ai/api/search-image?query=Modern%20clean%20shower%20room%20with%20pale%20beige%20tiles%2C%20glass%20partition%2C%20warm%20soft%20lighting%2C%20neatly%20folded%20white%20towels%20on%20a%20wooden%20stool%2C%20calm%20minimal%20interior%20photography&width=800&height=600&seq=fac-07&orientation=landscape",
  },
  {
    name: "유족 휴게실",
    size: "빈소별 독립 공간",
    desc: "긴 장례 기간 편히 쉬실 수 있도록 마련한 전용 휴게실",
    image:
      "https://readdy.ai/api/search-image?query=Peaceful%20small%20rest%20lounge%20with%20a%20neatly%20made%20bed%20and%20soft%20sofa%2C%20warm%20lamp%20glow%2C%20sheer%20curtain%20daylight%2C%20ivory%20and%20sage%20green%20palette%2C%20quiet%20minimal%20interior%20photography&width=800&height=600&seq=fac-08&orientation=landscape",
  },
  {
    name: "조리실",
    size: "유족 전용 조리 공간",
    desc: "조문객을 맞이할 음식을 준비할 수 있는 조리실",
    image:
      "https://readdy.ai/api/search-image?query=Clean%20simple%20kitchenette%20with%20light%20wood%20cabinets%2C%20stone%20countertop%2C%20ceramic%20teapot%20and%20cups%2C%20soft%20window%20light%2C%20calm%20ivory%20and%20sage%20green%20tones%2C%20minimal%20interior%20photography&width=800&height=600&seq=fac-09&orientation=landscape",
  },
];

export const GUIDE_STEPS = [
  {
    meta: "01 · 사전 상담",
    title: "장례식장 방문 및 사전 상담",
    items: [
      "전문 장례지도사와 장례 절차 전반에 대한 사전 상담을 진행합니다.",
      "빈소 규모와 조문객 예상 인원을 확인한 뒤 이용 가능한 빈소를 배정합니다.",
      "24시간 상담이 가능하며, 임종 전에도 미리 상담을 받아두실 수 있습니다.",
    ],
  },
  {
    meta: "02 · 사망 당일 · 1일차",
    title: "임종 및 고인 안치",
    items: [
      "의사로부터 사망진단서를 발급받습니다. 화장 예약과 사망신고를 위해 넉넉히 준비해 주세요.",
      "전용 운구차량으로 고인을 장례식장으로 모시고 안치실에 정중히 안치합니다.",
      "상주와 유가족은 장례지도사와 상의하여 장례 일정, 빈소, 상복, 도우미 등을 결정합니다.",
    ],
  },
  {
    meta: "03 · 2일차",
    title: "빈소 설치 및 입관",
    items: [
      "종교와 유가족의 예법에 맞추어 제단과 영정을 설치하고 빈소를 차립니다.",
      "부고를 알리고 상주·유가족이 상복을 갖춘 뒤 조문객을 맞이합니다.",
      "발인 전날에는 염습과 입관을 진행하며, 유가족이 참관하실 수 있습니다.",
    ],
  },
  {
    meta: "04 · 3일차",
    title: "발인 및 장지 이동",
    items: [
      "발인제를 지낸 뒤 영구를 운구차량에 모시고 장지로 출발합니다.",
      "발인제가 끝나면 영구를 장지 또는 화장시설까지 운반하는 절차가 이어집니다.",
      "장례지도사의 안내에 따라 순차적으로 진행하시면 됩니다.",
    ],
  },
  {
    meta: "05 · 장례 이후",
    title: "하관 · 화장 · 봉안",
    items: [
      "매장을 선택하신 경우 장지에서 영구를 광중에 내리는 하관(下棺)을 진행합니다.",
      "화장을 선택하신 경우 화장시설 방문 전 화장 예약을 먼저 확인해 주세요.",
      "화장 후에는 유골을 모셔 봉안당, 자연장 등 원하시는 방식으로 안치합니다.",
    ],
  },
];

export const ABOUT_IMAGE = "/images/about-hall.jpg";
