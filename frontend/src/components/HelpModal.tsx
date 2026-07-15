import { useTranslation } from "react-i18next";
import { Modal, Button } from "./ui";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: HelpModalProps) {
  const { t } = useTranslation();

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <Modal open={open} onClose={onClose} title={t("help")}>
      <div className="space-y-6">
        {/* Intro */}
        <p className="text-sm dark:text-gray-400 text-gray-600">
          ANKI-HELPER는 일본어 단어를 입력하면 AI가 읽기, 정의, 예문, 음성을 생성하고,
          AnkiConnect를 통해 로컬 Anki에 카드를 추가하는 서비스입니다.
        </p>

        {/* Step 1 */}
        <Step number={1} title="Install Anki and AnkiConnect">
          <p>PC에 Anki Desktop을 설치하고, AnkiConnect 애드온을 추가한 뒤 Anki를 재시작하세요.</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => window.open("https://ankiweb.net/shared/info/2055492159", "_blank")}
            >
              AnkiConnect 페이지
            </Button>
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => copyText("2055492159")}
            >
              코드 복사 2055492159
            </Button>
          </div>
        </Step>

        {/* Step 2 */}
        <Step number={2} title="Allow this site in AnkiConnect">
          <p>
            Anki → Tools → Add-ons → AnkiConnect → Config에서{" "}
            <code className="dark:bg-gray-800 bg-gray-100 px-1.5 py-0.5 rounded text-xs">webCorsOriginList</code>에
            이 사이트 주소를 추가하고 저장 후 Anki를 재시작하세요.
          </p>
          <div className="mt-2 p-3 rounded-lg dark:bg-gray-800 bg-gray-100 font-mono text-xs overflow-x-auto">
            <pre>{`"webCorsOriginList": [\n  "http://localhost",\n  "https://d1mqc9eqoybz0l.cloudfront.net"\n]`}</pre>
          </div>
          <Button
            variant="secondary"
            className="text-xs mt-2"
            onClick={() => copyText("https://d1mqc9eqoybz0l.cloudfront.net")}
          >
            Origin 복사
          </Button>
        </Step>

        {/* Step 3 */}
        <Step number={3} title="Sign up and log in">
          <p>회원가입 후 이메일 인증을 완료하면 카드 생성 기능을 사용할 수 있습니다.</p>
        </Step>

        {/* Step 4 */}
        <Step number={4} title="Create recommended Anki setup">
          <p>
            Settings 페이지에서 덱 이름, 카드 모드, 글꼴을 선택하고
            "Create recommended Anki setup"을 눌러 노트 타입(signife_anki_helper)을 자동 생성하세요.
          </p>
        </Step>

        {/* Step 5 */}
        <Step number={5} title="Generate cards">
          <p>
            Cards 페이지에서 일본어 단어를 입력하고 Generate를 누르면 AI가 읽기, 정의, 예문, 유의어, 한자 정보를 생성합니다.
            결과를 확인한 뒤 Anki에 추가할 수 있습니다.
          </p>
        </Step>

        {/* Step 6 */}
        <Step number={6} title="Add to Anki">
          <p>
            Anki Desktop과 AnkiConnect가 실행 중인 PC에서 카드를 선택하고 "Add to Anki"를 누르세요.
            음성이 자동 생성되어 카드와 함께 저장됩니다.
          </p>
        </Step>

        {/* Note */}
        <div className="p-3 rounded-xl dark:bg-indigo-500/10 bg-indigo-50 text-sm dark:text-gray-300 text-gray-600">
          <strong>Note:</strong> 카드 데이터는 AWS 클라우드에 저장되지만, 음성 파일과 Anki 카드 자체는
          AnkiConnect를 통해 사용자의 로컬 Anki에만 저장됩니다.
        </div>
      </div>
    </Modal>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white text-xs font-bold">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <div className="text-sm dark:text-gray-400 text-gray-600 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}
