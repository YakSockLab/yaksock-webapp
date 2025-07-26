"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  X,
  HelpCircle,
  MoreHorizontal,
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Plus,
  CircleDotDashed,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

type Screen =
  | "home"
  | "privacy-consent"
  | "privacy-policy"
  | "photo-upload"
  | "ocr-loading"
  | "manual-input"
  | "dur-loading"
  | "results-issues"
  | "results-no-issues"

const AppContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-sm mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden h-[844px] flex flex-col">
    {children}
  </div>
)

const AppHeader = ({
  onBack,
  onExit,
  title,
  showHelp = false,
  buttonClassName,
}: { onBack?: () => void; onExit?: () => void; title?: string; showHelp?: boolean; buttonClassName?: string }) => (
  <header className="flex items-center justify-between p-4 h-14 shrink-0 z-10">
    {onBack ? (
      <Button variant="ghost" size="icon" onClick={onBack} className={buttonClassName}>
        <ChevronLeft className="w-6 h-6" />
      </Button>
    ) : (
      <div className="w-10" />
    )}
    {title && <h1 className="text-lg font-semibold">{title}</h1>}
    {onExit ? (
      <Button variant="ghost" size="icon" onClick={onExit} className={buttonClassName}>
        <X className="w-6 h-6" />
      </Button>
    ) : showHelp ? (
      <Button variant="ghost" size="icon" className={buttonClassName}>
        <HelpCircle className="w-6 h-6" />
      </Button>
    ) : (
      <div className="w-10" />
    )}
  </header>
)

const HomeScreen = ({ onNext, onShowPolicy }: { onNext: () => void; onShowPolicy: () => void }) => (
  <div className="flex flex-col h-full bg-gray-50">
    <AppHeader />
    <div className="pt-2 px-6">
      <h1 className="text-2xl font-bold leading-tight text-left mb-4">
        여러 곳에서 받은 약,
        <br />
        성분이 겹칠까 걱정되시나요?
      </h1>
      <p className="text-sm text-gray-500 text-left leading-relaxed">
        가지고 계신 약 정보 부분을 찍어주세요!
        <br />
        성분 중복 여부를 꼼꼼히 확인해 드려요!
      </p>
    </div>
    <div className="flex-grow flex items-center justify-center">
      <Image src="/mascot.svg" width={0} height={0} sizes="100vw" alt="Mascot" className="w-1/3 h-auto" />
    </div>
    <div className="p-6">
      <Button
        className="w-full h-14 text-base rounded-full text-white font-medium"
        style={{ backgroundColor: "#524CFF" }}
        onClick={onNext}
      >
        사진으로 확인하기
      </Button>
      <div className="mt-4 text-xs text-gray-400 text-center">
        <button onClick={onShowPolicy} className="underline">
          개인정보 처리방침
        </button>{" "}
        |{" "}
        <button onClick={onShowPolicy} className="underline">
          서비스 이용약관
        </button>
      </div>
    </div>
  </div>
)

const PrivacyConsentModal = ({
  open,
  onOpenChange,
  onAgree,
  onShowPolicy,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgree: () => void
  onShowPolicy: () => void
}) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleAgree = () => {
    if (isChecked) {
      onAgree()
    }
  }

  if (!open) return null

  return (
    <>
      <div className="modal-overlay" onClick={() => onOpenChange(false)} />
      <div className="modal-content" data-state={open ? "open" : "closed"}>
        <header className="flex items-center justify-between p-4 h-14 shrink-0">
          <div className="w-10" />
          <div className="w-10" />
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-6 h-6" />
          </Button>
        </header>
        <div className="px-6 pb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">약 정보 확인을 위해 동의가 필요해요</h2>
            <p className="text-sm text-gray-500">
              사진을 올리면, 약 이름과 성분을 자동으로 살펴봐요
              <br />
              <b>분석 후 30초 안에 사진이 삭제되고 저장되지 않아요</b>
            </p>
          </div>

          <div className="py-6">
            <div
              className="flex items-center justify-between rounded-lg cursor-pointer"
              onClick={() => setIsChecked(!isChecked)}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`w-6 h-6 ${isChecked ? "text-[#524CFF]" : "text-gray-300"}`} />
                <div className="text-sm font-medium">
                  <span className="text-[#524CFF] font-bold">(필수)</span>
                  민감정보 수집 이용 동의서
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onShowPolicy()
                }}
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>

          <Button
            className={`w-full h-12 text-sm rounded-xl font-medium transition-colors ${
              isChecked ? "bg-[#524CFF] text-white" : "bg-gray-200 text-gray-400 hover:bg-gray-200"
            }`}
            onClick={handleAgree}
            disabled={!isChecked}
          >
            동의하고 계속하기
          </Button>
        </div>
      </div>
    </>
  )
}

const PrivacyPolicyScreen = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col h-full">
    <header className="flex items-center p-4 h-14 shrink-0 text-white" style={{ backgroundColor: "#524CFF" }}>
      <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">민감정보 수집 이용 동의서</h1>
    </header>
    <div className="flex-grow overflow-y-auto p-6 text-sm">
      <p className="font-bold mb-4">
        본 개인정보처리방침은 약속연구소(이하 '당사')가 제공하는 중복 약물 비교 서비스(이하 '서비스')에서 이용자의
        개인정보를 어떻게 처리하고 보호하는지를 설명합니다.
      </p>
      <h2 className="font-bold text-base mt-6 mb-2">제1조 (개인정보의 처리 목적)</h2>
      <p className="mb-4">
        당사는 다음의 목적을 위하여 최소한의 개인정보를 처리합니다. 처리된 정보는 아래 목적 외의 용도로는 사용되지
        않으며, 목적 변경 시에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받습니다.
      </p>
      <ol className="list-decimal list-inside space-y-2">
        <li>약물 분석 서비스 제공</li>
        <li>
          사용자가 업로드하거나 촬영한 약 사진 또는 처방전을 OCR로 인식하고, DUR API를 연동해 약물 정보를 분석·제공하기
          위한 목적
        </li>
        <li>민원 응대 및 오류 처리</li>
        <li>
          사용자가 제공한 정보 또는 시스템 사용 로그를 기반으로 사용자 문의에 응답하고, 시스템 오류 및 이슈를 파악하기
          위한 목적
        </li>
      </ol>
      <h2 className="font-bold text-base mt-6 mb-2">제2조 (개인정보의 수집 항목 및 수집 방법)</h2>
      <h3 className="font-semibold mt-4 mb-2">1. 수집 항목</h3>
      <p className="mb-4">
        본 서비스는 원칙적으로 개인 식별 가능한 정보는 수집하지 않습니다. 다만, 시스템 운영을 위해 다음과 같은 정보가
        일시적으로 수집될 수 있습니다.
      </p>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">구분</th>
            <th className="border border-gray-300 p-2">수집항목</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">필수</td>
            <td className="border border-gray-300 p-2">업로드한 이미지(약 사진, 처방전), OCR 결과 텍스트</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">자동수집</td>
            <td className="border border-gray-300 p-2">기기 정보(모델, OS), 사용 시각, 접속 로그, IP주소 등</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)

const PhotoUploadScreen = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }) => (
  <div className="flex flex-col h-full bg-gray-50">
    <AppHeader onBack={onBack} showHelp />
    <div className="px-6">
      <h1 className="text-2xl font-bold leading-tight text-left mb-4">비교할 약 사진을 첨부해주세요</h1>
      <p className="text-sm text-gray-500 mt-2">사진 속 약 이름을 추출한 뒤, 성분을 확인하고 비교해요</p>
      <p className="text-xs text-gray-400 mt-1">* 10MB 이하 JPG/PNG 파일만 업로드 가능해요</p>
    </div>
    <div className="flex-grow flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-full h-40 bg-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-500">
        <UploadCloud className="w-8 h-8 mb-2" />
        <p>첫 번째 약 사진 업로드</p>
      </div>
      <div className="w-full h-40 bg-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-500">
        <UploadCloud className="w-8 h-8 mb-2" />
        <p>두 번째 약 사진 업로드</p>
      </div>
    </div>
    <div className="p-6">
      <Button
        className="w-full h-14 text-base rounded-full font-medium"
        style={{ backgroundColor: "#EEEDFF", color: "#8E8E91" }}
        onClick={onNext}
      >
        사진 첨부하기
      </Button>
    </div>
  </div>
)

const ManualInputScreen = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }) => (
  <div className="flex flex-col h-full bg-gray-50">
    <AppHeader onBack={onBack} />
    <div className="px-6">
      <h1 className="text-2xl font-bold leading-tight text-left mb-4">
        안전을 위해 한번 더
        <br />
        함께 살펴봐요
      </h1>
      <p className="text-sm text-gray-500 mt-2">잘못된 정보는 텍스트를 눌러서 수정하실 수 있어요.</p>
    </div>
    <div className="px-6 mt-4">
      <Tabs defaultValue="photo1" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photo1">약 사진 1</TabsTrigger>
          <TabsTrigger value="photo2">약 사진 2</TabsTrigger>
        </TabsList>
        <TabsContent value="photo1">
          <Card className="w-full p-4 mt-4 rounded-2xl shadow-lg">
            <CardContent className="p-0 space-y-2">
              {["명문아모클란정", "베포스타비정", "뮤코란정", "레보티진정"].map((drug) => (
                <div key={drug} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span>{drug}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>삭제하기</DropdownMenuItem>
                      <DropdownMenuItem>수정하기</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              <div className="flex items-center p-2 bg-gray-100 rounded-lg">
                <Input defaultValue="에스오엠정20mg" className="border-none focus-visible:ring-0 bg-transparent" />
                <Button size="sm" className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200">
                  확인
                </Button>
              </div>
              <div className="flex justify-center pt-2">
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0 bg-gray-200">
                  <Plus className="w-6 h-6 text-gray-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    <div className="p-6 mt-auto">
      <Button
        className="w-full h-14 text-base rounded-full text-white font-medium"
        style={{ backgroundColor: "#524CFF" }}
        onClick={onNext}
      >
        성분 확인하기
      </Button>
    </div>
  </div>
)

const OcrLoadingScreen = ({ onNext }: { onNext: () => void }) => {
  useState(() => {
    const timer = setTimeout(() => {
      onNext()
    }, 3000) // 3초 후 다음 페이지로 이동

    return () => clearTimeout(timer)
  })

  return (
    <div className="flex flex-col h-full bg-[#F9F9F9]">
      <AppHeader />
      <div className="px-8 pt-8">
        <h1 className="text-2xl font-bold leading-tight text-left mb-4">
          약 성분을 확인하고 있어요
          <br />
          조금만 기다려주세요
        </h1>
      </div>
      <div className="flex-grow flex items-center mb-32 justify-center">
        <Image src="/ocr-loading.svg" width={0} height={0} sizes="240vw" alt="OCR Loading" className="w-auto h-auto" />
      </div>
    </div>
  )
}

const DurLoadingScreen = ({ onNext }: { onNext: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0)

  useState(() => {
    const steps = [
      { delay: 1000, step: 1 }, // 성분 정보 확인
      { delay: 1000, step: 2 }, // 중복 성분 비교
      { delay: 1000, step: 3 }, // 상호작용 점검
      { delay: 1000, step: 4 }, // 복약 안전성 분석
      { delay: 3000, step: 5 }, // 결과 준비 (3초 후 다음 페이지)
    ]

    let totalDelay = 0
    steps.forEach(({ delay, step }) => {
      totalDelay += delay
      setTimeout(() => {
        if (step === 5) {
          onNext()
        } else {
          setCurrentStep(step)
        }
      }, totalDelay)
    })
  })

  const stepItems = [
    { id: 1, text: "성분 정보를 확인하고 있어요" },
    { id: 2, text: "중복 성분을 비교하고 있어요" },
    { id: 3, text: "상호작용을 점검하고 있어요" },
    { id: 4, text: "복약 안전성을 분석하고 있어요" },
    { id: 5, text: "결과를 준비하고 있어요" },
  ]

  return (
    <div className="flex flex-col h-full bg-[#F9F9F9]">
      <AppHeader />
      <div className="flex-grow flex flex-col p-8 justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-tight text-left mb-4">
            중복 성분을 점검하고 있어요
            <br />
            조금만 기다려주세요
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Image src="/mascot.svg" width={0} height={0} sizes="100vw" alt="Mascot" className="w-1/3 h-auto" />
        </div>

        <Card className="w-full p-6 rounded-2xl shadow-lg">
          <CardContent className="p-0 space-y-5 text-left">
            {stepItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center ${currentStep >= item.id ? "text-[#3E39BF]" : "text-gray-400"}`}
              >
                {currentStep >= item.id ? (
                  <CheckCircle2 className="w-5 h-5 mr-3" style={{ color: "#3E39BF" }} />
                ) : currentStep === item.id - 1 && item.id <= 4 ? (
                  <CircleDotDashed className="w-5 h-5 mr-3 animate-spin" />
                ) : currentStep === 4 && item.id === 5 ? (
                  <CircleDotDashed className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <CircleDotDashed className="w-5 h-5 mr-3" />
                )}
                <p className="font-medium">{item.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const resultsData = [
  {
    id: "item-1",
    title: "동일성분중복",
    count: 2,
    content: {
      duplicates: [
        {
          title: "1번째 중복성분",
          drugs: [
            { name: "마이스틴정", ingredient: "아젤라스틴염산염", color: "purple" },
            { name: "동성아젤라스틴정", ingredient: "아젤라스틴염산염", color: "yellow" },
          ],
        },
        {
          title: "2번째 중복성분",
          drugs: [
            { name: "하이돔텐정", ingredient: "돔페리돈말레산염", color: "yellow" },
            { name: "클래신정", ingredient: "클래리트로마이신", color: "purple" },
          ],
        },
      ],
      description: [
        "마이스틴정과 아젤라스틴정은 동일 성분 중복입니다.",
        "아클라정375mg과 아모클란정375mg은 동일 성분 중복입니다.",
      ],
    },
  },
  { id: "item-2", title: "효능군중복", count: 0, content: null },
  { id: "item-3", title: "임부금기", count: 0, content: null },
  { id: "item-4", title: "노인주의", count: 0, content: null },
  { id: "item-5", title: "특정연령대주의", count: 0, content: null },
]

const DrugInfoCard = ({
  name,
  ingredient,
  color,
}: { name: string; ingredient: string; color: "purple" | "yellow" }) => {
  const colorStyles = {
    purple: {
      bg: "bg-[#EEEDFF]",
      border: "border-[#E2E0FF]",
    },
    yellow: {
      bg: "bg-[#FFFBE9]",
      border: "border-[#FFF1D7]",
    },
  }
  const styles = colorStyles[color]

  return (
    <div className={`p-2 rounded-lg text-center text-sm border ${styles.bg} ${styles.border}`}>
      {name}
      <br />
      <span className="text-xs text-gray-500">({ingredient})</span>
    </div>
  )
}

const ResultsScreen = ({ onBack, onExit }: { onBack: () => void; onExit: () => void }) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#9E7BFF] to-[#F9F9F9] text-white relative">
      <AppHeader onBack={onBack} onExit={onExit} buttonClassName="text-white hover:bg-white/10" />
      <div className="px-6">
        <h1 className="text-2xl font-bold leading-tight text-left mb-4">
          함께 복용 시 주의가
          <br />
          필요한 약이 있어요
        </h1>
        <Button variant="ghost" size="icon" className="mt-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full">
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>

      <div className="absolute top-32 right-6">
        <Image src="/mascot.svg" width={100} height={100} alt="Mascot" />
      </div>

      <div
        className="flex-grow overflow-y-auto p-6 mt-8 bg-transparent text-black z-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Accordion type="multiple" className="w-full space-y-3" value={openItems} onValueChange={setOpenItems}>
          {resultsData.map((item) => {
            const isOpen = openItems.includes(item.id)

            return (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border-none"
              >
                <AccordionTrigger className="text-lg font-semibold no-underline hover:no-underline [&>svg]:hidden">
                  <div className="flex items-center justify-between w-full">
                    <span style={{ color: "#FF575C" }}>{item.title}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm text-white font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: "#FF575C" }}
                      >
                        {item.count}건 조회
                      </span>
                      <ChevronDown
                        className={`h-6 w-6 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        style={{ color: "#FF575C" }}
                      />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  {item.content ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {item.content.duplicates.map((dup) => (
                          <div key={dup.title} className="bg-[#F5F5F5] text-[#565658] p-4 rounded-xl">
                            <h4 className="font-semibold mb-2 text-center">{dup.title}</h4>
                            <div className="space-y-2">
                              {dup.drugs.map((drug) => (
                                <DrugInfoCard key={drug.name} {...drug} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <h4 className="font-semibold mb-2">설명</h4>
                      <ul className="list-disc list-inside text-sm text-[#565658] space-y-1">
                        {item.content.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-[#565658]">세부 정보가 없습니다.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
      <footer className="bg-transparent text-xs text-gray-400 text-left p-4 z-10">
        * 본 결과는 의료 전문가의 판단을 대신하지 않으며, 복용 전 상담이 필요할 수 있습니다.
      </footer>
    </div>
  )
}

const NoResultsScreen = ({
  onBack,
  onExit,
  onRestart,
}: { onBack: () => void; onExit: () => void; onRestart: () => void }) => (
  <div className="flex flex-col h-full bg-gradient-to-b from-[#9E7BFF] to-[#F9F9F9] text-white relative">
    <AppHeader onBack={onBack} onExit={onExit} buttonClassName="text-white hover:bg-white/10" />
    <div className="px-6">
      <h1 className="text-2xl font-bold leading-tight text-left mb-4">
        이번 약은 특별한
        <br />
        주의 정보가 없어요
      </h1>
      <Button variant="ghost" size="icon" className="mt-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full">
        <HelpCircle className="w-5 h-5" />
      </Button>
    </div>

    <div className="absolute top-32 right-6">
      <Image src="/mascot.svg" width={100} height={100} alt="Mascot" />
    </div>

    <div
      className="flex-grow overflow-y-auto p-6 mt-8 bg-transparent text-black z-10 flex flex-col"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border-none flex-grow flex flex-col justify-center items-center text-center">
        <Image src="/no-results.svg" width={80} height={80} alt="No Results" className="mx-auto mb-6" />
        <p className="text-gray-500 mb-8">
          약이 바뀌거나 추가될 땐,
          <br />
          다시 한 번 확인해 보세요
        </p>
        <Button
          className="w-full h-14 text-base rounded-full text-white font-medium"
          style={{ backgroundColor: "#524CFF" }}
          onClick={onRestart}
        >
          다른 약 확인하기
        </Button>
      </div>
    </div>
    <footer className="bg-transparent text-xs text-gray-400 text-left p-4 z-10">
      * 본 결과는 의료 전문가의 판단을 대신하지 않으며, 복용 전 상담이 필요할 수 있습니다.
    </footer>
  </div>
)

export default function YakSockApp() {
  const [screen, setScreen] = useState<Screen>("home")
  const [consentModalOpen, setConsentModalOpen] = useState(false)

  const handleNavigation = (targetScreen: Screen) => {
    setScreen(targetScreen)
  }

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return (
          <HomeScreen
            onNext={() => setConsentModalOpen(true)}
            onShowPolicy={() => handleNavigation("privacy-policy")}
          />
        )
      case "privacy-policy":
        return <PrivacyPolicyScreen onBack={() => handleNavigation("home")} />
      case "photo-upload":
        return (
          <PhotoUploadScreen onBack={() => handleNavigation("home")} onNext={() => handleNavigation("ocr-loading")} />
        )
      case "ocr-loading":
        return <OcrLoadingScreen onNext={() => handleNavigation("manual-input")} />
      case "manual-input":
        return (
          <ManualInputScreen
            onBack={() => handleNavigation("photo-upload")}
            onNext={() => handleNavigation("dur-loading")}
          />
        )
      case "dur-loading":
        const nextScreen = "results-issues"
        return <DurLoadingScreen onNext={() => handleNavigation(nextScreen)} />
      case "results-issues":
        return <ResultsScreen onBack={() => handleNavigation("photo-upload")} onExit={() => handleNavigation("home")} />
      case "results-no-issues":
        return (
          <NoResultsScreen
            onBack={() => handleNavigation("photo-upload")}
            onExit={() => handleNavigation("home")}
            onRestart={() => handleNavigation("home")}
          />
        )
      default:
        return (
          <HomeScreen
            onNext={() => setConsentModalOpen(true)}
            onShowPolicy={() => handleNavigation("privacy-policy")}
          />
        )
    }
  }

  return (
    <main className="bg-gray-200 p-8">
      <AppContainer>
        {renderScreen()}
        <PrivacyConsentModal
          open={consentModalOpen}
          onOpenChange={setConsentModalOpen}
          onAgree={() => {
            setConsentModalOpen(false)
            handleNavigation("photo-upload")
          }}
          onShowPolicy={() => {
            setConsentModalOpen(false)
            handleNavigation("privacy-policy")
          }}
        />
      </AppContainer>
    </main>
  )
}
