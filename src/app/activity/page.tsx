import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "국민연금 매매 내역 | NPS 13F 트래커",
  description:
    "국민연금(NPS)의 최근 미국 주식 매수/매도 내역을 확인하세요. SEC 13F 공시 기반 분기별 거래 내역.",
};

export default function ActivityPage() {
  // Redirect to the main page with activity tab
  redirect("/?tab=activity");
}
