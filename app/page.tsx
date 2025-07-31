"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDotDashed,
  HelpCircle,
  MoreHorizontal,
  Plus,
  UploadCloud,
  X,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SplashScreen } from "@/components/splash-screen"
import { usePrivacyConsent } from "@/hooks/use-privacy-consent"

// --- TYPES ---
type Screen =
  | "home"
  | "privacy-consent"
  | "privacy-policy"
  | "photo-upload"
  | "ocr-loading"
  | "manual-input"
  | "dur-loading"
  | "results"

type DrugList = {
  upload_id: string
  drug_names: string[]
}

type DrugIngredient = {
  drugName: string
  ingrCode: string | null
}

type DurResult = {
  [key: string]: {
    drugName: string
    precaution: string
    naturalPrecaution?: string
  }[]
}

// --- API FUNCTIONS ---
async function uploadImages(files: File[]): Promise<{ uploadIds: string[] }> {
  const formData = new FormData()
  files.forEach((file) => formData.append("images", file))
  const response = await fetch("/api/upload-image", { method: "POST", body: formData })
  if (!response.ok) throw new Error("Image upload failed")
  const data = await response.json()
  console.log(data)
  return { uploadIds: data.uploadIds }
}

async function extractOcr(uploadIds: string[]): Promise<{ drugNames: DrugList[] }> {
  const response = await fetch("/api/ocr-extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ upload_ids: uploadIds }),
  })
  if (!response.ok) throw new Error("OCR extraction failed")
  const data = await response.json()
  console.log(data)
  return { drugNames: data.drugNames }
}

async function getIngredients(drugNames: string[]): Promise<{ ingredients: DrugIngredient[] }> {
  const response = await fetch("/api/drug-to-ingredient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drug_names: drugNames }),
  })
  if (!response.ok) throw new Error("Failed to get ingredients")
  const data = await response.json()
  console.log(data)
  return { ingredients: data.ingredients }
}

async function checkInteractions(ingredients: DrugIngredient[]): Promise<{ durResult: DurResult }> {
  const response = await fetch("/api/check-drug-interaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drugs: ingredients }),
  })
  if (!response.ok) throw new Error("Failed to check interactions")
  const data = await response.json()
  console.log(data)
  return { durResult: data.durResult }
}

async function getLlmInterpretation(durResult: DurResult): Promise<{ finalResult: DurResult }> {
  const response = await fetch("/api/llm-interpretation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ durResult }),
  })
  if (!response.ok) throw new Error("Failed to get LLM interpretation")
  const data = await response.json()
  console.log(data)
  return { finalResult: data.durResult }
}

// --- UI COMPONENTS ---

const AppContainer = ({ children, isLandscape }: { children: React.ReactNode; isLandscape: boolean }) => (
  <div
    className={`relative w-full h-full bg-white overflow-hidden flex flex-col ${
      isLandscape ? "aspect-[9/19.5] shadow-2xl rounded-3xl" : ""
    }`}
  >
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
  <div className="flex flex-col h-full bg-yak-gray-bg">
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
      <Button className="w-full h-14 text-base rounded-full text-white font-medium bg-yak-purple" onClick={onNext}>
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
  isLandscape,
  open,
  onOpenChange,
  onAgree,
  onShowPolicy,
}: {
  isLandscape: boolean
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
      <div className={isLandscape ? "modal-overlay-landscape" : "modal-overlay"} onClick={() => onOpenChange(false)} />
      <div className={isLandscape ? "modal-content-landscape" : "modal-content"} data-state={open ? "open" : "closed"}>
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
                <CheckCircle2 className={`w-6 h-6 ${isChecked ? "text-yak-purple" : "text-gray-300"}`} />
                <div className="text-sm font-medium">
                  <span className="text-yak-purple font-bold">(필수)</span>
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
              isChecked ? "bg-yak-purple text-white" : "bg-gray-200 text-gray-400 hover:bg-gray-200"
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
    <header className="flex items-center p-4 h-14 shrink-0 text-white bg-yak-purple">
      <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">민감정보 수집 이용 동의서</h1>
    </header>
    <div className="flex-grow overflow-y-auto p-6 text-sm">{/* Policy content remains the same */}</div>
  </div>
)

const PhotoUploadScreen = ({
  onBack,
  onUploadSuccess,
}: {
  onBack: () => void
  onUploadSuccess: (uploadIds: string[]) => void
}) => {
  const [files, setFiles] = useState<(File | null)[]>([null, null])
  const [previews, setPreviews] = useState<(string | null)[]>([null, null])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    const newFiles = [...files]
    newFiles[index] = file
    setFiles(newFiles)

    const newPreviews = [...previews]
    newPreviews[index] = URL.createObjectURL(file)
    setPreviews(newPreviews)
  }

  const handleUpload = async () => {
    const uploadedFiles = files.filter((file) => file !== null) as File[]
    if (uploadedFiles.length === 0) return

    setIsUploading(true)
    try {
      const { uploadIds } = await uploadImages(uploadedFiles)
      onUploadSuccess(uploadIds)
    } catch (error) {
      console.error(error)
      alert("사진 전송에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsUploading(false)
    }
  }

  const isButtonDisabled = files.every((file) => file === null) || isUploading

  return (
    <div className="flex flex-col h-full bg-yak-gray-bg">
      <AppHeader onBack={onBack} showHelp />
      <div className="px-6">
        <h1 className="text-2xl font-bold leading-tight text-left mb-2">비교할 약 사진을 첨부해주세요</h1>
        <p className="text-sm text-gray-500 mt-1">사진 속 약 이름을 추출한 뒤, 성분을 확인하고 비교해요</p>
        <p className="text-xs text-gray-400 mt-1">* 10MB 이하 JPG/PNG 파일만 첨부 가능해요</p>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center gap-4 px-6">
        {[0, 1].map((index) => (
          <div key={index} className="w-full">
            <input
              type="file"
              ref={fileInputRefs[index]}
              onChange={(e) => handleFileChange(e, index)}
              className="hidden"
              accept="image/png, image/jpeg"
            />
            <div
              className="w-full h-40 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 cursor-pointer"
              onClick={() => fileInputRefs[index].current?.click()}
            >
              {previews[index] ? (
                <Image
                  src={(previews[index] as string) || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full rounded-2xl"
                />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-gray-400">{index + 1}번째 약 사진 첨부</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-6">
        <Button
          className="w-full h-14 text-base rounded-full font-medium bg-yak-purple text-white disabled:bg-yak-purple-light disabled:text-yak-gray-dark"
          onClick={handleUpload}
          disabled={isButtonDisabled}
        >
          {isUploading ? "전송 중..." : "사진 첨부하기"}
        </Button>
      </div>
    </div>
  )
}

const OcrLoadingScreen = ({
  uploadIds,
  onOcrSuccess,
  onBack,
}: {
  uploadIds: string[]
  onOcrSuccess: (drugLists: DrugList[]) => void
  onBack: () => void
}) => {
  useEffect(() => {
    const processOcr = async () => {
      try {
        const { drugNames } = await extractOcr(uploadIds)
        onOcrSuccess(drugNames)
      } catch (error) {
        console.error(error)
        alert("약 이름 추출에 실패했습니다. 다시 시도해주세요.")
        onBack()
      }
    }
    if (uploadIds.length > 0) {
      processOcr()
    }
  }, [uploadIds, onOcrSuccess, onBack])

  return (
    <div className="flex flex-col h-full bg-yak-gray-bg">
      <AppHeader />
      <div className="px-8 pt-8">
        <h1 className="text-2xl font-bold leading-tight text-left mb-4">
          약 성분을 확인하고 있어요
          <br />
          조금만 기다려주세요
        </h1>
      </div>
      <div className="flex-grow flex items-center mb-32 justify-center">
        <Image src="/ocr-loading.svg" width={235} height={133} alt="OCR Loading" className="w-2/3 h-auto" />
      </div>
    </div>
  )
}

const DrugItem = ({
  drugName,
  onUpdate,
  onDelete,
}: {
  drugName: string
  onUpdate: (newName: string) => void
  onDelete: () => void
}) => {
  const [isEditing, setIsEditing] = useState(drugName === "")
  const [currentName, setCurrentName] = useState(drugName)

  const handleConfirm = () => {
    if (currentName.trim() === "") {
      onDelete()
      setIsEditing(false)
    } else {
      onUpdate(currentName.trim())
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center p-2 bg-yak-purple-light rounded-lg">
        <Input
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          placeholder="직접 입력"
          className="border-none focus-visible:ring-0 bg-transparent text-yak-purple-text placeholder:text-yak-gray"
          autoFocus
        />
        <Button size="sm" className="bg-transparent text-yak-purple-text hover:bg-transparent" onClick={handleConfirm}>
          확인
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 bg-yak-purple-bg rounded-lg">
      <span className="text-gray-800">{drugName}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreHorizontal className="w-5 h-5 text-yak-gray" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#C2C3C6] border-none text-white">
          <DropdownMenuItem onSelect={onDelete} className="focus:bg-black/20 focus:text-white">
            삭제하기
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditing(true)} className="focus:bg-black/20 focus:text-white">
            수정하기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const ManualInputScreen = ({
  initialDrugLists,
  onBack,
  onNext,
}: {
  initialDrugLists: DrugList[]
  onBack: () => void
  onNext: (allDrugs: string[]) => void
}) => {
  const [drugLists, setDrugLists] = useState(initialDrugLists)
  const [activeTab, setActiveTab] = useState(initialDrugLists[0]?.upload_id || "")

  const handleUpdateDrug = (listIndex: number, drugIndex: number, newName: string) => {
    const newDrugLists = [...drugLists]
    newDrugLists[listIndex].drug_names[drugIndex] = newName
    setDrugLists(newDrugLists)
  }

  const handleDeleteDrug = (listIndex: number, drugIndex: number) => {
    const newDrugLists = [...drugLists]
    newDrugLists[listIndex].drug_names.splice(drugIndex, 1)
    setDrugLists(newDrugLists)
  }

  const handleAddDrug = (listIndex: number) => {
    const newDrugLists = [...drugLists]
    newDrugLists[listIndex].drug_names.push("")
    setDrugLists(newDrugLists)
  }

  const handleConfirm = () => {
    const allDrugs = drugLists.flatMap((list) => list.drug_names).filter(Boolean)
    onNext(allDrugs)
  }

  return (
    <div className="flex flex-col h-full bg-yak-gray-bg">
      <AppHeader onBack={onBack} />
      <div className="px-6">
        <h1 className="text-2xl font-bold leading-tight text-left mb-2">약 이름이 맞는지 확인해 주세요</h1>
        <p className="text-sm text-gray-500 mt-1">
          잘못된 약은 수정, 빠진 약은 추가, 필요 없는 약은 메뉴에서 삭제해 주세요
        </p>
      </div>
      <div className="px-6 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="tabs-list">
            {drugLists.map((list, index) => (
              <TabsTrigger key={list.upload_id} value={list.upload_id} className="tabs-trigger">
                약 사진 {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {drugLists.map((list, listIndex) => (
            <TabsContent key={list.upload_id} value={list.upload_id}>
              <Card className="w-full p-4 mt-4 rounded-2xl shadow-lg">
                <CardContent className="p-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">약 이름</h3>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <HelpCircle className="w-5 h-5 text-yak-gray" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {list.drug_names.map((drug, drugIndex) => (
                      <DrugItem
                        key={`${list.upload_id}-${drugIndex}-${drug}`}
                        drugName={drug}
                        onUpdate={(newName) => handleUpdateDrug(listIndex, drugIndex, newName)}
                        onDelete={() => handleDeleteDrug(listIndex, drugIndex)}
                      />
                    ))}
                    <div className="flex justify-center pt-2">
                      <Button
                        variant="ghost"
                        className="rounded-full w-10 h-10 p-0 bg-gray-200"
                        onClick={() => handleAddDrug(listIndex)}
                      >
                        <Plus className="w-6 h-6 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="p-6 mt-auto">
        <Button
          className="w-full h-14 text-base rounded-full text-white font-medium bg-yak-purple"
          onClick={handleConfirm}
        >
          성분 확인하기
        </Button>
      </div>
    </div>
  )
}

const DurLoadingScreen = ({
  drugNames,
  onDurSuccess,
  onBack,
}: {
  drugNames: string[]
  onDurSuccess: (result: DurResult) => void
  onBack: () => void
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const stepTexts = [
    "성분 정보를 확인하고 있어요",
    "중복 성분을 비교하고 있어요",
    "상호작용을 점검하고 있어요",
    "복약 안전성을 분석하고 있어요",
    "결과를 준비하고 있어요",
  ]

  useEffect(() => {
    const runDurCheck = async () => {
      try {
        // Step 1: Get ingredients
        const { ingredients } = await getIngredients(drugNames)
        setCurrentStep(1)

        // Step 2: Check interactions
        const { durResult } = await checkInteractions(ingredients)
        setCurrentStep(2)
        setCurrentStep(3)

        // Step 3: Get LLM interpretation
        const { finalResult } = await getLlmInterpretation(durResult)
        setCurrentStep(4)

        // Final step
        setTimeout(() => {
          onDurSuccess(finalResult)
        }, 1000)
      } catch (error) {
        console.error(error)
        alert("성분 분석 중 오류가 발생했습니다.")
        onBack()
      }
    }
    runDurCheck()
  }, [drugNames, onDurSuccess, onBack])

  return (
    <div className="flex flex-col h-full bg-yak-gray-bg">
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
            {stepTexts.map((text, index) => (
              <div
                key={index}
                className={`flex items-center ${currentStep >= index ? "text-[#3E39BF]" : "text-gray-400"}`}
              >
                {currentStep > index ? (
                  <CheckCircle2 className="w-5 h-5 mr-3 text-[#3E39BF]" />
                ) : currentStep === index ? (
                  <CircleDotDashed className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <CircleDotDashed className="w-5 h-5 mr-3" />
                )}
                <p className="font-medium">{text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const DrugInfoCard = ({
  drugName,
  precaution,
  color,
}: {
  drugName: string
  precaution: string
  color: "purple" | "yellow"
}) => {
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
      {drugName}
      <br />
      <span className="text-xs text-gray-500">({precaution})</span>
    </div>
  )
}

const ResultsScreen = ({
  durResult,
  onBack,
  onExit,
  onRestart,
}: {
  durResult: DurResult | null
  onBack: () => void
  onExit: () => void
  onRestart: () => void
}) => {
  const [resultsData, setResultsData] = useState<any[]>([])
  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    if (!durResult) return

    const transformedData = Object.entries(durResult).map(([title, items]) => {
      if (items.length === 0) {
        return { title, content: null }
      }

      const precautionGroups: { [key: string]: any[] } = {}
      items.forEach((item) => {
        const key = item.precaution
        if (!precautionGroups[key]) {
          precautionGroups[key] = []
        }
        precautionGroups[key].push(item)
      })

      const duplicates = Object.values(precautionGroups).map((drugs, groupIndex) => ({
        drugs,
        color: groupIndex % 2 === 0 ? "purple" : "yellow",
      }))

      const descriptions = items
        .map((item) => item.naturalPrecaution || item.precaution)
        .filter((desc, index, arr) => arr.indexOf(desc) === index)

      return {
        title,
        content: {
          duplicates,
          descriptions,
        },
      }
    })

    setResultsData(transformedData)
    setOpenItems(transformedData.filter((item) => item.content).map((item) => item.title))
  }, [durResult])

  const hasIssues = resultsData.some((item) => item.content !== null)

  return (
    <div className="flex flex-col h-full text-black bg-yak-gray-bg">
      <div className="shrink-0">
        <AppHeader onBack={onBack} onExit={onExit} />
        <div className="px-6">
          <h1 className="text-2xl font-bold leading-tight text-left">
            {hasIssues ? (
              <>
                함께 복용 시 주의가
                <br />
                필요한 약이 있어요
              </>
            ) : (
              <>
                이번 약은 따로 확인된
                <br />
                주의 정보가 없어요
              </>
            )}
          </h1>
          <Button variant="ghost" size="icon" className="mt-2 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full">
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="relative px-6">
          <div className="flex justify-center">
            <Image
              src={hasIssues ? "/mascot-results.svg" : "/mascot-no-results.svg"}
              width={80}
              height={80}
              alt="Mascot"
            />
          </div>

          <div className="relative -mt-12 z-10">
            {hasIssues ? (
              <Accordion type="multiple" className="w-full space-y-3" value={openItems} onValueChange={setOpenItems}>
                {resultsData.map((item) => {
                  if (!item.content) return null
                  const isOpen = openItems.includes(item.title)
                  const totalCount = item.content.duplicates.reduce(
                    (sum: number, group: any) => sum + group.drugs.length,
                    0,
                  )

                  return (
                    <AccordionItem
                      key={item.title}
                      value={item.title}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md border-none"
                    >
                      <AccordionTrigger className="text-lg font-semibold no-underline hover:no-underline [&>svg]:hidden">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[#4743C6]">{item.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[#FFDFDC] text-[#FE5348]">
                              {totalCount}건 조회
                            </span>
                            <ChevronDown
                              className={`h-6 w-6 shrink-0 transition-transform duration-200 text-[#C2C3C6] ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {item.content.duplicates.map((dupGroup: any, groupIndex: number) => (
                              <div key={groupIndex} className="bg-[#F5F5F5] text-[#565658] p-4 rounded-xl">
                                <h4 className="font-semibold mb-2 text-center">{groupIndex + 1}번째 성분</h4>
                                <div className="space-y-2">
                                  {dupGroup.drugs.map((drug: any, drugIndex: number) => (
                                    <DrugInfoCard key={drugIndex} {...drug} color={dupGroup.color} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <h4 className="font-semibold mb-2">설명</h4>
                          <ul className="list-disc list-inside text-sm text-[#565658] space-y-1">
                            {item.content.descriptions.map((desc: string, i: number) => (
                              <li key={i}>{desc}</li>
                            ))}
                          </ul>
                        </>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-md border-none">
                <div className="flex flex-col items-center text-center">
                  <Image src="/no-results.svg" width={100} height={100} alt="No Results" className="mx-auto mb-6" />
                  <p className="text-gray-500 mb-8">
                    약이 바뀌거나 추가될 땐,
                    <br />
                    다시 한 번 확인해 보세요
                  </p>
                  <Button
                    className="w-full h-14 text-base rounded-full text-white font-medium bg-yak-purple"
                    onClick={onRestart}
                  >
                    다른 약 확인하기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="shrink-0 bg-[#F7F7FA] text-xs text-gray-400 text-left p-4 flex items-start gap-1 z-20">
        <span className="text-gray-400 font-bold">ⓘ</span>
        <span>본 결과는 의료 전문가의 판단을 대신하지 않으며, 복용 전 상담이 필요할 수 있습니다.</span>
      </footer>
    </div>
  )
}

export default function YakSockApp() {
  const [screen, setScreen] = useState<Screen>("home")
  const [showSplash, setShowSplash] = useState(true)
  const [isLandscape, setIsLandscape] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const { isLoading, hasConsented, giveConsent } = usePrivacyConsent()

  // State for API flow
  const [uploadIds, setUploadIds] = useState<string[]>([])
  const [drugLists, setDrugLists] = useState<DrugList[]>([])
  const [finalDrugNames, setFinalDrugNames] = useState<string[]>([])
  const [durResult, setDurResult] = useState<DurResult | null>(null)

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)
    return () => clearTimeout(splashTimer)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const newIsLandscape = window.innerWidth / window.innerHeight > 1
      setIsLandscape(newIsLandscape)
      document.documentElement.classList.toggle("landscape", newIsLandscape)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const resetState = () => {
    setUploadIds([])
    setDrugLists([])
    setFinalDrugNames([])
    setDurResult(null)
    setScreen("home")
  }

  if (showSplash) {
    return (
      <main className="h-screen w-screen flex items-center justify-center p-0 bg-[#B4B4B4]">
        <div className={isLandscape ? "h-full" : "w-full h-full"}>
          <AppContainer isLandscape={isLandscape}>
            <SplashScreen />
          </AppContainer>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="h-screen w-screen flex items-center justify-center p-0 bg-[#B4B4B4]">
        <div className={isLandscape ? "h-full" : "w-full h-full"}>
          <AppContainer isLandscape={isLandscape}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yak-purple"></div>
          </AppContainer>
        </div>
      </main>
    )
  }

  const handleConsentAgree = () => {
    giveConsent()
    setShowConsentModal(false)
    setScreen("photo-upload")
  }

  const handleStartPhotoUpload = () => {
    if (hasConsented) {
      setScreen("photo-upload")
    } else {
      setShowConsentModal(true)
    }
  }

  const handleUploadSuccess = (ids: string[]) => {
    setUploadIds(ids)
    setScreen("ocr-loading")
  }

  const handleOcrSuccess = (lists: DrugList[]) => {
    setDrugLists(lists)
    setScreen("manual-input")
  }

  const handleManualInputNext = (allDrugs: string[]) => {
    setFinalDrugNames(allDrugs)
    setScreen("dur-loading")
  }

  const handleDurSuccess = (result: DurResult) => {
    setDurResult(result)
    setScreen("results")
  }

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return (
          <>
            <HomeScreen onNext={handleStartPhotoUpload} onShowPolicy={() => setScreen("privacy-policy")} />
            <PrivacyConsentModal
              isLandscape={isLandscape}
              open={showConsentModal}
              onOpenChange={setShowConsentModal}
              onAgree={handleConsentAgree}
              onShowPolicy={() => setScreen("privacy-policy")}
            />
          </>
        )
      case "privacy-policy":
        return <PrivacyPolicyScreen onBack={() => setScreen("home")} />
      case "photo-upload":
        return <PhotoUploadScreen onBack={() => setScreen("home")} onUploadSuccess={handleUploadSuccess} />
      case "ocr-loading":
        return (
          <OcrLoadingScreen
            uploadIds={uploadIds}
            onOcrSuccess={handleOcrSuccess}
            onBack={() => setScreen("photo-upload")}
          />
        )
      case "manual-input":
        return (
          <ManualInputScreen
            initialDrugLists={drugLists}
            onBack={() => setScreen("photo-upload")}
            onNext={handleManualInputNext}
          />
        )
      case "dur-loading":
        return (
          <DurLoadingScreen
            drugNames={finalDrugNames}
            onDurSuccess={handleDurSuccess}
            onBack={() => setScreen("manual-input")}
          />
        )
      case "results":
        return (
          <ResultsScreen
            durResult={durResult}
            onBack={() => setScreen("manual-input")}
            onExit={resetState}
            onRestart={resetState}
          />
        )
      default:
        return <HomeScreen onNext={handleStartPhotoUpload} onShowPolicy={() => setScreen("privacy-policy")} />
    }
  }

  return (
    <main className="h-screen w-screen flex items-center justify-center p-0 bg-[#B4B4B4]">
      <div className={isLandscape ? "h-full" : "w-full h-full"}>
        <AppContainer isLandscape={isLandscape}>{renderScreen()}</AppContainer>
      </div>
    </main>
  )
}
