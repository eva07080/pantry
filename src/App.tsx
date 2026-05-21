/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChefHat, 
  Refrigerator, 
  User, 
  Home as HomeIcon, 
  Clock, 
  Users, 
  Heart, 
  ArrowLeft, 
  Share2, 
  PlayCircle, 
  Leaf, 
  CheckCircle2, 
  PlusCircle,
  MoreHorizontal,
  Edit2,
  UtensilsCrossed,
  Flame,
  Droplets,
  Zap,
  ChevronRight
} from 'lucide-react';

// --- Types ---

type View = 'home' | 'recipes' | 'fridge' | 'profile' | 'recipe-detail' | 'scanner';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  difficulty: '초보자' | '보통' | '고수';
  ingredients: { name: string; amount: string; inStock: boolean; icon: string }[];
  steps: { title: string; text: string; tip?: string }[];
  nutrition: { calories: number; protein: string; carbs: string; fat: string };
  tags: string[];
  category: string;
  isFeatured?: boolean;
}

interface Ingredient {
  id: string;
  name: string;
  description: string;
  amount: string;
  expiryDate: string;
  daysLeft: number;
  category: '냉장' | '냉동' | '실온';
  image?: string;
  status: 'ok' | 'warning' | 'error';
}

// --- Mock Data ---

const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: '봄 아스파라거스와 부라타 타르트',
    description: '냉장고에 있는 신선한 아스파라거스를 활용해 20분 만에 완성하는 고급스러운 요리입니다. 바삭하고 부드러우며 싱그러운 초록빛이 가득합니다.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx4ZZl0EzXIOBHNlv_2MNjVczGXCht8E8gGvzOf1enL2dQwqlHhtgTAQuM3hMN-37mLkqd0Rh6nAiLWy8Hj5a6O3wIGfV3OabTIQIwN38XIKK5K0D3X70rdSGABSbPWBmo_z4altHaSJa_qyNNAV_c29zrSzklrcNc9QZJz0lE39zWNcmS0OWSDQf1IwPv1maPbl4E7cDY19Y5cYQQTJHXSHSs3e76qqSrYW6FzSPz9leShbc1DlnSnxbPciMOmyhg-p_yXd_mzOE',
    time: '25분',
    difficulty: '초보자',
    ingredients: [
      { name: '유기농 퀴노아', amount: '1컵', inStock: true, icon: 'Leaf' },
      { name: '투스칸 케일', amount: '큰 1단', inStock: true, icon: 'Leaf' },
      { name: '페타 치즈', amount: '100g', inStock: false, icon: 'Zap' },
      { name: '타히니 소스', amount: '2 테이블스푼', inStock: true, icon: 'Droplets' },
    ],
    steps: [
      { 
        title: '베이스 준비하기', 
        text: '퀴노아를 찬물에 헹굽니다. 냄비에 퀴노아와 물 2컵을 넣고 끓입니다. 물이 끓으면 불을 낮추고 뚜껑을 덮은 뒤, 물이 완전히 흡수될 때까지 15분간 뭉근하게 익힙니다.',
        tip: '물을 붓기 전 마른 퀴노아를 2분 정도 볶으면 더욱 깊고 고소한 향을 낼 수 있습니다.'
      },
      { 
        title: '채소 찌기', 
        text: '팬에 올리브 오일을 두르고 달굽니다. 다진 케일과 물을 약간 넣습니다. 뚜껑을 덮고 3-5분간 케일이 선명한 초록색을 띠고 부드러워질 때까지 익힙니다. 바다 소금과 갓 깬 흑후추로 간을 합니다.' 
      },
      { 
        title: '최종 완성', 
        text: '익힌 퀴노아를 포크로 가볍게 섞어 두 개의 그릇에 나누어 담습니다. 그 위에 찐 케일, 부순 페타 치즈를 올리고 타히니 소스를 듬뿍 뿌립니다. 따뜻할 때 바로 드세요.' 
      },
    ],
    nutrition: { calories: 420, protein: '14g', carbs: '52g', fat: '18g' },
    tags: ['지중해식', '셰프의 추천'],
    category: '전체 레시피',
    isFeatured: true
  },
  {
    id: '2',
    title: '에어룸 토마토 샐러드',
    description: '신선한 에어룸 토마토와 발사믹 글레이즈가 어우러진 상큼한 샐러드입니다.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpdd4yfSR1Tyqp1UinHMo_jDNq_lQM2dYgJD55DDDoGZlf8AiSJwZx7y5ENeDOGRdYtGpe1A5U723NZuUMt8HLK_-PTQho_uEt_b5cxeDfH2JjP0hERSFpuxIajp9NEv4JFtO5Y8svlj0PBkyD0EFVY405zQRcjMsOLpKDscnF_A-gmemyiPjLifDFgJRaJYvg6UHm84hZvB-3JP_70K81KaL7dAi2D-1WY0IryYZWBvOsYhguYmI8Baddf2wXa5vXynWO4saLP_8',
    time: '15분',
    difficulty: '초보자',
    ingredients: [],
    steps: [],
    nutrition: { calories: 250, protein: '5g', carbs: '15g', fat: '18g' },
    tags: ['채식', '제철 요리'],
    category: '제철 채소'
  },
  {
    id: '3',
    title: '완벽한 아보카도 토스트',
    description: '바삭한 사워도우 위에 부드러운 아보카도와 수란을 얹은 아침 식사입니다.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClgGjZaxCziusTeuvFmoxSNGNKMIgCWcXTjui4Dd9Ibp_wNyvbKEb2P9BS0ayC7-ckHlXWY5F93mg_4tHEYcUNol7_frcAt0h55M5b_nJ-gHFtag5migyCGS8Q6KBuMLEIFt1wdZ8q1XV-gA2D7ZklgWdQTgOe2Xf2u3W4OA5ZcmoAxKGS2ar5Xbr6PU-yJ6Nl-RCtkNX9tu5BtR4JKdy5WZH3oBRDY7DS0HtasST-y8farhEpczgKYmCm9DUyspiYs0bnVBnrxlQ',
    time: '10분',
    difficulty: '초보자',
    ingredients: [],
    steps: [],
    nutrition: { calories: 380, protein: '12g', carbs: '35g', fat: '22g' },
    tags: ['비건', '아침 식사'],
    category: '아침 식사'
  },
  {
    id: '4',
    title: '레몬 허브 치킨',
    description: '레몬과 허브로 마리네이드하여 오븐에 구운 촉촉한 치킨 요리입니다.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO6Wkx3NPC0qqlHt2iGfELlxiGBFAkg6UOF8ZMHAEuCfqDsDs6zsgcQgEFxnyyhJgINEzSbdp-8m33zbrdV19HMf7xboNrDoFDSdNvuTp_YXyR9VeGdwMeKAslVL8UXmi4Zejq1Hz_G1Zxk08Ep_DuGbIbfpLZ5o_POWcKUeurRTMZv5UwFVeXPUVAt_h21wpsUIMNnY32sWznnwaYsLUqvAw1xpMUYPsQoBevo7uxkG_ZuKvy9izMesfMFYUF8IF4j8ojnG0PuW0',
    time: '45분',
    difficulty: '보통',
    ingredients: [],
    steps: [],
    nutrition: { calories: 520, protein: '45g', carbs: '10g', fat: '28g' },
    tags: ['건강식', '고단백'],
    category: '간편한 저녁'
  }
];

const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: '1', name: '유기농 시금치', description: '그린 스무디를 만들거나 마늘과 함께 볶아 드셔보세요.', amount: '250g', expiryDate: '10월 24일', daysLeft: 1, category: '냉장', status: 'error' },
  { id: '2', name: '방목란', description: '특란, A등급', amount: '12개', expiryDate: '10월 24일', daysLeft: 8, category: '냉장', status: 'ok' },
  { id: '3', name: '그릭 요거트', description: '플레인, 전지', amount: '1 통 (500g)', expiryDate: '10월 12일', daysLeft: 2, category: '냉장', status: 'warning' },
  { id: '4', name: '무염 버터', description: '목초 사육', amount: '250g', expiryDate: '11월 02일', daysLeft: 15, category: '냉장', status: 'ok' },
  { id: '5', name: '유기농 당근', description: '흙당근, 잎 포함', amount: '1 묶음', expiryDate: '10월 18일', daysLeft: 5, category: '냉장', status: 'ok', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtraolEzm2XvqVsYG4fc_kn7ynsD-fVDO5OaCFpS0D5XwEeJqullRhhMrGDbI_-v7UOBrTHGCsPh0mQyqNj1yTzuQklzCv6L6szqElUcrOUImx5xgbyPr-eApy9kk3yYzyjtbC2vWxfJu_4XDWVAYjAC72QrReBYRahNQmtB2YS4n0YMfiYJ84XI_KvIcVJCbVCmewKtSYL0sikbGxv0PqbUpaFAN664NO9C9Xvrya_OwAHvmhaYJUILR3UapMIgatIt62s3zJYYM' },
  { id: '6', name: '귀리 우유', description: '바리스타 에디션', amount: '850ml', expiryDate: '10월 09일', daysLeft: 12, category: '냉장', status: 'ok' },
];

// --- Components ---

// --- Components ---

const ScannerView = ({ onAdd, onCancel }: { onAdd: (item: Ingredient) => void; onCancel: () => void }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCapturing, setIsCapturing] = useState(true);
  const [detectedItem, setDetectedItem] = useState<Partial<Ingredient> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
      }
    }

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setIsScanning(true);
    setIsCapturing(false);
    
    // Simulate AI processing after capture
    setTimeout(() => {
      setIsScanning(false);
      setDetectedItem({
        name: '신선한 아보카도',
        description: '잘 익은 멕시코산 아보카도',
        amount: '2개',
        category: '냉장',
        expiryDate: '10월 28일',
        daysLeft: 7,
        status: 'ok'
      });
    }, 2000);
  };

  const handleRetry = () => {
    setIsCapturing(true);
    setIsScanning(false);
    setDetectedItem(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="relative flex-grow overflow-hidden">
        {/* Camera Feed */}
        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
          {error ? (
            <div className="text-white text-center p-6">
              <p className="mb-4">{error}</p>
              <button 
                onClick={onCancel}
                className="px-6 py-2 bg-primary rounded-xl font-bold"
              >
                돌아가기
              </button>
            </div>
          ) : (
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Scanning Overlay */}
        {isCapturing && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <div className="w-full aspect-square border-2 border-white/30 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
            </div>
            <p className="mt-8 text-white font-bold text-lg tracking-wide drop-shadow-lg">
              식재료를 사각형 안에 맞춰주세요
            </p>
          </div>
        )}

        {isScanning && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-12">
            <div className="w-full aspect-square border-2 border-primary rounded-3xl relative overflow-hidden">
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(38,104,41,0.8)] z-10"
              />
            </div>
            <p className="mt-8 text-white font-bold text-lg tracking-wide">
              AI가 식재료를 분석하고 있습니다...
            </p>
          </div>
        )}

        <button 
          onClick={onCancel}
          className="absolute top-12 left-6 p-3 bg-black/20 backdrop-blur-md rounded-full text-white z-20"
        >
          <ArrowLeft size={24} />
        </button>

        {isCapturing && !error && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20">
            <button 
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
            >
              <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {!isScanning && !isCapturing && detectedItem && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-surface rounded-t-[2.5rem] p-8 space-y-6 z-30"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-surface-container rounded-2xl flex items-center justify-center">
                <Leaf className="text-primary" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-on-surface">{detectedItem.name}</h3>
                <p className="text-on-surface-variant">{detectedItem.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface-container rounded-xl">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant opacity-60">수량</p>
                <p className="font-bold">{detectedItem.amount}</p>
              </div>
              <div className="p-4 bg-surface-container rounded-xl">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant opacity-60">유통기한</p>
                <p className="font-bold">{detectedItem.expiryDate}</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleRetry}
                className="flex-1 py-4 rounded-xl font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                다시 찍기
              </button>
              <button 
                onClick={() => onAdd(detectedItem as Ingredient)}
                className="flex-[2] py-4 rounded-xl font-bold text-on-primary bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                냉장고에 추가하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Navbar = ({ currentView, setView }: { currentView: View; setView: (v: View) => void }) => {
  const navItems = [
    { id: 'home', label: '홈', icon: HomeIcon },
    { id: 'fridge', label: '냉장고', icon: Refrigerator },
    { id: 'recipes', label: '레시피', icon: ChefHat },
    { id: 'profile', label: '내 정보', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/70 backdrop-blur-xl rounded-t-2xl shadow-[0_-8px_24px_rgba(11,54,29,0.06)] border-t border-outline-variant/10">
      <div className="flex justify-around items-center px-4 pb-6 pt-3 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'recipes' && currentView === 'recipe-detail');
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-200 active:scale-90 ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container rounded-2xl' 
                  : 'text-outline hover:text-primary'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const TopBar = ({ title, showBack, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) => (
  <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl">
    <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-xl mx-auto">
      {showBack ? (
        <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 text-primary">
          <ArrowLeft size={24} />
        </button>
      ) : (
        <button className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 text-primary">
          <Search size={24} />
        </button>
      )}
      <h1 className="font-headline text-xl font-bold text-on-surface tracking-[-0.02em]">{title}</h1>
      <div className="flex items-center gap-2">
        {showBack ? (
          <>
            <button className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 text-primary">
              <Heart size={24} />
            </button>
            <button className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 text-primary">
              <Share2 size={24} />
            </button>
          </>
        ) : (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <img 
              alt="사용자 프로필" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA__SezUVapSJ0kCLVeQ_9cYRN7PweZDVPFBNSjJ0eL46L1vMLnLeNCo-UnFnSMRKWwDM5ioK8EZuUlcPt7RAjpLRb1b3YjHMMqUPirb9-dC7t-f9-63kk4R6StCsrj8oHlcF4duLPM5T_LpTU7Wz0rIJ3jjFraub6LuKBH5KfmcXtZ1LlATGtGBQ1SvpuRj7GC4rwjid32RIgNCcVDXLhF1-k7xteZ2yaQFVNQuoRQxuMfz_uypMCtsrqSRWDAGCPoFXWgMPx4eNw" 
            />
          </div>
        )}
      </div>
    </div>
  </header>
);

// --- Page Views ---

const HomeView = ({ onRecipeClick, ingredients }: { onRecipeClick: (r: Recipe) => void; ingredients: Ingredient[] }) => {
  const expiringItems = ingredients.filter(i => i.daysLeft <= 3);
  const featuredRecipe = INITIAL_RECIPES.find(r => r.isFeatured);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-32"
    >
      <section>
        <p className="text-on-surface-variant font-medium text-sm">다시 오신 것을 환영해요, 사라님</p>
        <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-on-surface">오늘의 신선 피드</h2>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold tracking-tight">곧 유통기한 만료</h3>
          <button className="text-primary font-bold text-sm hover:underline">모두 보기</button>
        </div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar -mx-6 px-6 pb-4">
          {expiringItems.map((item) => (
            <div key={item.id} className="min-w-[160px] bg-surface-container-lowest p-4 rounded-2xl shadow-[0_8px_24px_rgba(11,54,29,0.06)] flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-xl bg-surface-container-low mb-3 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Leaf className="text-primary opacity-50" size={32} />
                )}
              </div>
              <span className="text-on-surface font-bold text-sm">{item.name}</span>
              <div className="flex items-center gap-1.5 mt-2">
                <div className={`w-2 h-2 rounded-full ${item.status === 'error' ? 'bg-error' : 'bg-tertiary-container'} animate-pulse`}></div>
                <span className={`${item.status === 'error' ? 'text-error' : 'text-on-tertiary-container'} text-[10px] font-extrabold uppercase tracking-wider`}>
                  {item.daysLeft}일 남음
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {featuredRecipe && (
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold tracking-tight">오늘의 추천 레시피</h3>
            <span className="bg-primary-container text-on-primary-container px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">유통기한 임박 품목 기반</span>
          </div>
          <div 
            onClick={() => onRecipeClick(featuredRecipe)}
            className="relative group cursor-pointer overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_12px_32px_rgba(11,54,29,0.08)]"
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-5/12 p-3">
                <div className="h-64 md:h-full rounded-xl overflow-hidden relative">
                  <img 
                    src={featuredRecipe.image} 
                    alt={featuredRecipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-surface/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Clock size={14} />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">{featuredRecipe.time}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-7/12 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex gap-2 mb-3">
                    <span className="text-tertiary-container text-[10px] font-extrabold uppercase tracking-widest">셰프의 선택</span>
                  </div>
                  <h4 className="text-2xl font-bold text-on-surface mb-2 leading-tight">{featuredRecipe.title}</h4>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed">{featuredRecipe.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-primary" />
                      <span className="text-xs font-medium">유통기한 임박 품목 3가지 사용</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed size={16} className="text-primary" />
                      <span className="text-xs font-medium">{featuredRecipe.difficulty}용</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                  요리 시작하기
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container p-6 rounded-2xl flex flex-col justify-between min-h-[140px]">
          <Refrigerator className="text-primary" size={24} />
          <div>
            <span className="text-2xl font-extrabold block">42</span>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">전체 품목</span>
          </div>
        </div>
        <div className="bg-primary-container p-6 rounded-2xl flex flex-col justify-between min-h-[140px]">
          <Leaf className="text-on-primary-container" size={24} />
          <div>
            <span className="text-2xl font-extrabold block text-on-primary-container">86%</span>
            <span className="text-xs font-bold text-on-primary-container uppercase tracking-wider">신선도 점수</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const RecipesView = ({ onRecipeClick }: { onRecipeClick: (r: Recipe) => void }) => {
  const [activeCategory, setActiveCategory] = useState('전체 레시피');
  const categories = ['전체 레시피', '간편한 저녁', '아침 식사', '제철 채소', '비건 선택'];

  const filteredRecipes = INITIAL_RECIPES.filter(r => activeCategory === '전체 레시피' || r.category === activeCategory);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-32"
    >
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-grow max-w-2xl">
            <input 
              className="w-full py-4 pl-14 pr-6 bg-surface-container-lowest border-none rounded-xl font-headline text-on-surface shadow-[0_8px_24px_rgba(11,54,29,0.06)] focus:ring-2 focus:ring-primary/20 placeholder:text-outline/50" 
              placeholder="제철 레시피 검색..." 
              type="text"
            />
            <UtensilsCrossed className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
          </div>
          <div className="flex items-center gap-4 bg-surface-container rounded-full px-5 py-3 shadow-[0_8px_24px_rgba(11,54,29,0.06)]">
            <span className="font-sans text-sm font-bold text-on-surface-variant uppercase tracking-wider">내 재료로 필터링</span>
            <button className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1 transition-colors">
              <div className="w-4 h-4 bg-on-primary rounded-full translate-x-6"></div>
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-8 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 font-bold rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-primary-container text-on-primary-container' 
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredRecipes.map((recipe) => (
          <article 
            key={recipe.id}
            onClick={() => onRecipeClick(recipe)}
            className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden shadow-[0_8px_24px_rgba(11,54,29,0.06)] group cursor-pointer active:scale-95 transition-transform duration-200"
          >
            <div className="relative h-64 mx-3 mt-3 rounded-xl overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-surface/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-on-surface">{recipe.time}</div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-headline text-xl font-bold text-on-surface">{recipe.title}</h3>
                <Heart size={20} className="text-tertiary-container" />
              </div>
              <div className="flex gap-2">
                {recipe.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter rounded">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-outline text-xs font-bold">
                  <Zap size={16} />
                  <span>{recipe.difficulty}</span>
                </div>
                <div className="flex items-center gap-1.5 text-outline text-xs font-bold">
                  <Refrigerator size={16} />
                  <span>{recipe.ingredients.length || 4}개 재료</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
};

const FridgeView = ({ ingredients, onAddClick }: { ingredients: Ingredient[]; onAddClick: () => void }) => {
  const [activeTab, setActiveTab] = useState('냉장');
  const tabs = ['냉장', '냉동', '실온'];

  const filteredIngredients = ingredients.filter(i => i.category === activeTab);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-32"
    >
      <section>
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">재고 관리</p>
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">신선한 식재료</h2>
      </section>

      <nav className="flex space-x-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${
              activeTab === tab 
                ? 'bg-primary-container text-on-primary-container shadow-sm' 
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hero Alert Card */}
        {activeTab === '냉장' && (
          <div className="md:col-span-2 lg:col-span-1 bg-surface-container rounded-[1.5rem] p-6 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            <div className="z-10">
              <span className="inline-flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                확인 필요
              </span>
              <h3 className="text-2xl font-bold leading-tight mb-2">유기농 시금치</h3>
              <p className="text-on-surface-variant text-sm">24시간 이내 만료 예정입니다. 그린 스무디를 만들거나 마늘과 함께 볶아 드셔보세요.</p>
            </div>
            <div className="z-10 flex justify-between items-end mt-4">
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant opacity-60">수량</p>
                <p className="text-xl font-bold">250g</p>
              </div>
              <button className="bg-primary text-on-primary rounded-xl px-4 py-2 text-sm font-bold active:scale-95 transition-transform">지금 사용하기</button>
            </div>
            <Leaf className="absolute -right-8 -bottom-8 opacity-10" size={160} />
          </div>
        )}

        {filteredIngredients.map((item) => (
          <div key={item.id} className="bg-surface-container-lowest rounded-[1.5rem] p-6 flex flex-col gap-4 shadow-[0_8px_24px_rgba(11,54,29,0.04)] hover:shadow-[0_8px_24px_rgba(11,54,29,0.08)] transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
                {item.name.includes('란') ? <Zap size={24} /> : item.name.includes('우유') ? <Droplets size={24} /> : <Leaf size={24} />}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">만료일</p>
                <p className={`text-sm font-bold ${item.status === 'warning' ? 'text-tertiary-container' : ''}`}>{item.expiryDate}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{item.name}</h4>
              <p className="text-sm text-on-surface-variant">{item.description}</p>
            </div>
            <div className="mt-auto pt-4 border-t border-surface-container-low flex justify-between items-center">
              <span className="text-xl font-bold">{item.amount}</span>
              <button className="text-outline hover:text-primary p-1"><MoreHorizontal size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onAddClick}
        className="fixed bottom-28 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-50"
      >
        <PlusCircle size={32} />
      </button>
    </motion.div>
  );
};

const RecipeDetailView = ({ recipe, onBack }: { recipe: Recipe; onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      <section className="relative w-full h-[442px] md:h-[530px] overflow-hidden -mt-16">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-primary-container/80 backdrop-blur-md text-on-primary-container text-xs font-bold uppercase tracking-wider">{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-2 leading-tight">{recipe.title}</h1>
        </div>
      </section>

      <div className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        <div className="lg:col-span-4 space-y-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-surface-container flex flex-col items-center text-center">
              <Clock className="text-primary mb-2" size={24} />
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">준비 시간</span>
              <span className="text-xl font-extrabold text-on-surface">{recipe.time}</span>
            </div>
            <div className="p-6 rounded-xl bg-surface-container flex flex-col items-center text-center">
              <Users className="text-primary mb-2" size={24} />
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">인분</span>
              <span className="text-xl font-extrabold text-on-surface">2인분</span>
            </div>
          </div>

          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-on-surface">냉장고 확인</h2>
              <span className="text-sm font-semibold text-primary underline underline-offset-4 cursor-pointer">부족한 재료 추가</span>
            </div>
            <div className="space-y-3">
              {recipe.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest shadow-[0_8px_24px_rgba(11,54,29,0.04)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                      {ing.icon === 'Leaf' ? <Leaf size={20} className="text-primary" /> : <Droplets size={20} className="text-primary" />}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{ing.name}</p>
                      <p className="text-xs text-on-surface-variant">{ing.amount}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${ing.inStock ? 'bg-primary-container/30' : 'bg-tertiary-container/30'}`}>
                    <div className={`w-2 h-2 rounded-full ${ing.inStock ? 'bg-primary' : 'bg-tertiary-container'}`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${ing.inStock ? 'text-on-primary-container' : 'text-on-tertiary-container'}`}>
                      {ing.inStock ? '보유 중' : '부족함'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8 border-b-4 border-surface-container-low pb-4">
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">조리 방법</h2>
              <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dim transition-all active:scale-95">
                <PlayCircle size={20} />
                가이드 모드 시작
              </button>
            </div>
            <div className="space-y-12">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="group flex gap-8">
                  <div className="flex-shrink-0">
                    <span className="text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-bold text-on-surface">{step.title}</h3>
                    <p className="text-on-surface-variant leading-relaxed text-lg">{step.text}</p>
                    {step.tip && (
                      <div className="p-4 bg-tertiary-container/10 border-l-4 border-tertiary-container rounded-r-lg">
                        <p className="text-sm font-bold text-on-tertiary-container flex items-center gap-2">
                          <Zap size={14} className="fill-tertiary-container" /> 셰프의 팁
                        </p>
                        <p className="text-sm text-on-tertiary-container italic">{step.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-8 rounded-[1.5rem] bg-surface-container relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">1인분 영양 정보</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-2xl font-black text-on-surface">{recipe.nutrition.calories}</p>
                <p className="text-xs font-bold text-outline uppercase">칼로리</p>
              </div>
              <div>
                <p className="text-2xl font-black text-on-surface">{recipe.nutrition.protein}</p>
                <p className="text-xs font-bold text-outline uppercase">단백질</p>
              </div>
              <div>
                <p className="text-2xl font-black text-on-surface">{recipe.nutrition.carbs}</p>
                <p className="text-xs font-bold text-outline uppercase">탄수화물</p>
              </div>
              <div>
                <p className="text-2xl font-black text-on-surface">{recipe.nutrition.fat}</p>
                <p className="text-xs font-bold text-outline uppercase">지방</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('recipe-detail');
  };

  const handleAddIngredient = (item: Ingredient) => {
    const newItem = { ...item, id: Date.now().toString() };
    setIngredients([newItem, ...ingredients]);
    setView('fridge');
  };

  const handleBack = () => {
    if (view === 'recipe-detail') {
      setView('recipes');
    } else if (view === 'scanner') {
      setView('fridge');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'home': return <HomeView onRecipeClick={handleRecipeClick} ingredients={ingredients} />;
      case 'recipes': return <RecipesView onRecipeClick={handleRecipeClick} />;
      case 'fridge': return <FridgeView ingredients={ingredients} onAddClick={() => setView('scanner')} />;
      case 'recipe-detail': return selectedRecipe ? <RecipeDetailView recipe={selectedRecipe} onBack={handleBack} /> : <HomeView onRecipeClick={handleRecipeClick} ingredients={ingredients} />;
      case 'scanner': return <ScannerView onAdd={handleAddIngredient} onCancel={() => setView('fridge')} />;
      default: return <HomeView onRecipeClick={handleRecipeClick} ingredients={ingredients} />;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'home': return 'MY Pantry';
      case 'recipes': return '레시피 탐색';
      case 'fridge': return '내 냉장고';
      case 'profile': return '내 정보';
      case 'recipe-detail': return '레시피 상세';
      case 'scanner': return '식재료 스캔';
      default: return 'MY Pantry';
    }
  };

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto">
      {view !== 'scanner' && (
        <TopBar 
          title={getTitle()} 
          showBack={view === 'recipe-detail'} 
          onBack={handleBack} 
        />
      )}
      
      <main className={view === 'scanner' ? '' : 'pt-24 px-6'}>
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      {view !== 'scanner' && <Navbar currentView={view} setView={setView} />}
    </div>
  );
}
