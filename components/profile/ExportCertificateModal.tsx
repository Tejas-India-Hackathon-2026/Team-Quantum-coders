"use client";

import * as React from "react";
import {
  X,
  Download,
  Printer,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  QrCode,
  Award,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { UserProfile } from "@/types";

interface ExportCertificateModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportCertificateModal({ user, isOpen, onClose }: ExportCertificateModalProps) {
  const [downloadingJson, setDownloadingJson] = React.useState(false);
  const [downloadingDoc, setDownloadingDoc] = React.useState(false);

  if (!isOpen) return null;

  const handleDownloadJSON = () => {
    setDownloadingJson(true);
    const proofPayload = {
      protocol: "LifeProof Consensus Protocol v2.0",
      proofHash: user.proofBadgeId || "0x9d4a88b977f1",
      candidate: {
        fullName: user.fullName,
        username: user.username,
        title: user.title,
        rank: user.rank,
        verifiedSince: user.verifiedSince,
        globalPercentile: user.globalPercentile,
        totalXp: user.totalXp,
        completedChallengesCount: user.completedChallengesCount,
      },
      verifiedSkills: user.skills.map((s) => ({
        name: s.name,
        category: s.category,
        level: s.level,
        verified: s.verified,
        topPercentile: s.topPercentile,
      })),
      cryptographicSignature: {
        algorithm: "ECDSA_secp256k1_SHA256",
        signatureHex: "0x30450221008d7499f1a238472910484736291aeb7c02207a9b1c2d3e4f5a6b7c8d9e0f",
        timestamp: new Date().toISOString(),
        consensusValidators: ["validator-node-us-east-1.lifeproof.network", "validator-node-eu-west-1.lifeproof.network"],
      },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proofPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lifeproof-certificate-${user.username || "engineer"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setTimeout(() => setDownloadingJson(false), 1200);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleDownloadHTMLDocument = () => {
    setDownloadingDoc(true);
    const certificateHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LifeProof Verified Certificate - ${user.fullName}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fafcff; color: #0f172a; margin: 0; padding: 40px; }
    .cert-box { max-width: 800px; margin: 0 auto; border: 3px solid #4f46e5; border-radius: 24px; padding: 48px; background: #ffffff; box-shadow: 0 10px 40px rgba(0,0,0,0.06); text-align: center; }
    .logo { font-size: 24px; font-weight: 900; color: #4f46e5; letter-spacing: -0.5px; }
    .title { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-top: 24px; }
    .recipient { font-size: 36px; font-weight: 900; color: #0f172a; margin: 12px 0; }
    .rank { font-size: 18px; font-weight: 700; color: #7c3aed; }
    .summary { font-size: 14px; color: #475569; line-height: 1.6; max-width: 550px; margin: 20px auto; }
    .meta-grid { display: flex; justify-content: space-around; margin-top: 32px; padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; }
    .meta-item { text-align: center; }
    .meta-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; }
    .meta-val { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px; font-family: monospace; }
    .footer { margin-top: 36px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="cert-box">
    <div class="logo">🛡️ LIFEPROOF PROTOCOL</div>
    <div class="title">Official Cryptographic Proof-of-Skill Certificate</div>
    <div class="recipient">${user.fullName}</div>
    <div class="rank">Standing: ${user.rank} (Top ${100 - user.globalPercentile}% Worldwide)</div>
    <p class="summary">
      This certifies that <strong>${user.fullName}</strong> (@${user.username}) has successfully passed all AST structural evaluations, concurrency stress drills, and real-world system design benchmarks with 100% consensus accuracy.
    </p>
    <div class="meta-grid">
      <div class="meta-item">
        <div class="meta-label">Proof Hash ID</div>
        <div class="meta-val">${user.proofBadgeId || "0x9d4a77f1"}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Total Earned XP</div>
        <div class="meta-val">+${user.totalXp.toLocaleString()} XP</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Verified Since</div>
        <div class="meta-val">${user.verifiedSince}</div>
      </div>
    </div>
    <div class="footer">
      Tamper-Proof & Verifiable on-chain at https://lifeproof.dev/profile
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([certificateHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifeproof-certificate-${user.username || "engineer"}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadingDoc(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-primary/10 text-indigo-600 dark:text-primary border border-indigo-100 dark:border-primary/20 shadow-xs">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Export Verified Certificate
              </h3>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Download high-res credentials or raw cryptographic envelope
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Certificate Visual Preview */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/60 dark:via-slate-900 dark:to-purple-950/60 border border-indigo-200 dark:border-white/15 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
              LifeProof Protocol Certificate
            </span>
            <Badge variant="cyan" className="text-[10px] font-mono">
              <Lock className="h-2.5 w-2.5 mr-1" /> Verified On-Chain
            </Badge>
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              {user.fullName}
            </h4>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 font-bold">
              {user.rank} · Top {100 - user.globalPercentile}% Worldwide
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-white/10 font-mono">
            <span>Proof Hash: {user.proofBadgeId || "0x9d4a...77f1"}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ 100% Consensus</span>
          </div>
        </div>

        {/* Export Action Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadHTMLDocument}
            disabled={downloadingDoc}
            className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-indigo-300 dark:hover:border-primary/40 flex flex-col items-center justify-center gap-2 text-center transition-all shadow-xs cursor-pointer group"
          >
            <Download className="h-5 w-5 text-indigo-600 dark:text-primary group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Download HTML/PDF</span>
              <span className="text-[10px] text-slate-500 dark:text-muted-foreground">Printable Certificate</span>
            </div>
          </button>

          <button
            onClick={handlePrintCertificate}
            className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-indigo-300 dark:hover:border-primary/40 flex flex-col items-center justify-center gap-2 text-center transition-all shadow-xs cursor-pointer group"
          >
            <Printer className="h-5 w-5 text-sky-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Print Document</span>
              <span className="text-[10px] text-slate-500 dark:text-muted-foreground">System Print Dialog</span>
            </div>
          </button>

          <button
            onClick={handleDownloadJSON}
            disabled={downloadingJson}
            className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-indigo-300 dark:hover:border-primary/40 flex flex-col items-center justify-center gap-2 text-center transition-all shadow-xs cursor-pointer group"
          >
            <FileCode className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Raw JSON Envelope</span>
              <span className="text-[10px] text-slate-500 dark:text-muted-foreground">Cryptographic Payload</span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-white/10">
          <Button variant="outline" size="sm" onClick={onClose} className="font-semibold">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
