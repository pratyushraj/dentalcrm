import { Customer } from './types';

export const generateSmileGalleryImage = (opts: {
  beforeSrc: string | null; afterSrc: string | null;
  clinicName: string; treatmentLabel: string;
  doctorName: string; qualifications: string; phone: string; logoSrc: string | null;
}): Promise<string> => new Promise((resolve, reject) => {
  const loadImg = (src: string | null): Promise<HTMLImageElement | null> =>
    src ? new Promise((res) => { 
      const i = new window.Image(); 
      if (!src.startsWith('data:')) {
        i.crossOrigin = 'anonymous';
      }
      i.onload = () => res(i); 
      i.onerror = () => res(null); 
      i.src = src; 
    }) : Promise.resolve(null);
  Promise.all([loadImg(opts.beforeSrc), loadImg(opts.afterSrc), loadImg(opts.logoSrc)]).then(([before, after, logo]) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080; canvas.height = 1080;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 1080, 1080);
      ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 8; ctx.strokeRect(4, 4, 1072, 1072);
      let logoW = 0;
      if (logo) {
        let w = logo.width, h = logo.height, r = w / h;
        if (w > 110) { w = 110; h = w / r; } if (h > 80) { h = 80; w = h * r; }
        ctx.drawImage(logo, 40, 45, w, h); logoW = w;
      }
      const tx = logoW > 0 ? 40 + logoW + 20 : 40;
      ctx.fillStyle = '#0F172A'; ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(opts.clinicName.toUpperCase(), tx, 45);
      ctx.fillStyle = '#6366F1'; ctx.font = 'bold 18px sans-serif';
      ctx.fillText(opts.treatmentLabel.toUpperCase(), tx, 98);
      ctx.fillStyle = '#FBBF24';
      const drawStar = (cx: number, cy: number) => {
        let rot = (Math.PI / 2) * 3; const step = Math.PI / 5;
        ctx.beginPath(); ctx.moveTo(cx, cy - 12);
        for (let i = 0; i < 5; i++) { ctx.lineTo(cx + Math.cos(rot)*12, cy + Math.sin(rot)*12); rot += step; ctx.lineTo(cx + Math.cos(rot)*6, cy + Math.sin(rot)*6); rot += step; }
        ctx.closePath(); ctx.fill();
      };
      for (let i = 0; i < 5; i++) drawStar(900 + i * 28, 70);
      const imgW = 490, imgH = 780, yOff = 180;
      const drawPhoto = (img: HTMLImageElement | null, x: number, label: string) => {
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
        ctx.fillStyle = '#F8FAFC'; ctx.beginPath(); (ctx as any).roundRect(x, yOff, imgW, imgH, 16); ctx.fill(); ctx.restore();
        if (img) {
          ctx.save(); ctx.beginPath(); (ctx as any).roundRect(x, yOff, imgW, imgH, 16); ctx.clip();
          const ir = img.width/img.height, br = imgW/imgH; let sx=0,sy=0,sw=img.width,sh=img.height;
          if (ir > br) { sw = img.height*br; sx = (img.width-sw)/2; } else { sh = img.width/br; sy = (img.height-sh)/2; }
          ctx.drawImage(img, sx, sy, sw, sh, x, yOff, imgW, imgH); ctx.restore();
        }
        ctx.save(); ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 3;
        ctx.beginPath(); (ctx as any).roundRect(x, yOff, imgW, imgH, 16); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.font = 'bold 20px sans-serif';
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = label === 'BEFORE' ? '#EF4444' : '#10B981';
        ctx.beginPath(); (ctx as any).roundRect(x+20, yOff+20, tw+30, 38, 8); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, x+20+(tw+30)/2, yOff+39); ctx.restore();
      };
      drawPhoto(before, 40, 'BEFORE'); drawPhoto(after, 550, 'AFTER');
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 15; ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#F8FAFC'; ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 2;
      ctx.beginPath(); (ctx as any).roundRect(40, 980, 1000, 80, 12); ctx.fill();
      ctx.shadowColor = 'transparent'; ctx.stroke(); ctx.restore();
      ctx.save(); ctx.textBaseline = 'middle'; ctx.fillStyle = '#1E293B';
      ctx.textAlign = 'left'; ctx.font = 'bold 22px sans-serif';
      const dr = opts.doctorName ? `Dr. ${opts.doctorName.replace(/^dr\.?\s+/i,'')}` : '';
      ctx.fillText(`🩺  ${dr || '✨  Transforming Smiles'}${opts.qualifications ? ` (${opts.qualifications})` : ''}`, 65, 1020);
      ctx.textAlign = 'right';
      if (opts.phone) ctx.fillText(`📞  ${opts.phone}`, 1015, 1020);
      ctx.restore();
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    } catch(e) { reject(e); }
  }).catch(reject);
});

export const getProxyUrl = (src: string | null): string | null => {
  if (!src) return null;
  if (src.startsWith('data:')) return src; // already base64
  if (src.includes('/public/creator-assets/')) {
    const parts = src.split('/public/creator-assets/');
    const filePath = parts[parts.length - 1];
    return `${window.location.origin}/api/whatsapp-helper/view-image?file=${encodeURIComponent(filePath)}`;
  }
  return src;
};

export const addSmileGalleryToPDF = async (
  doc: any,
  customer: Customer,
  clinicInfo: {
    clinicName: string;
    doctorName: string;
    qualifications: string;
    phone: string;
    logoUrl?: string;
  }
) => {
  const beforeSrc = getProxyUrl(customer.beforePhotos?.[0] || customer.beforePhoto || null);
  const afterSrc = getProxyUrl(customer.afterPhotos?.[0] || customer.afterPhoto || null);
  if (!beforeSrc && !afterSrc) return;

  try {
    const smileGalleryDataUrl = await generateSmileGalleryImage({
      beforeSrc,
      afterSrc,
      clinicName: clinicInfo.clinicName,
      treatmentLabel: customer.service || 'Smile Makeover',
      doctorName: clinicInfo.doctorName,
      qualifications: clinicInfo.qualifications,
      phone: clinicInfo.phone,
      logoSrc: getProxyUrl(clinicInfo.logoUrl || null)
    });

    const W = doc.internal.pageSize.getWidth();
    doc.addPage();

    const PRIMARY_TEAL = [15, 118, 110];
    const TEXT_MUTED = [100, 116, 139];
    const ACCENT_GOLD = [217, 119, 6];
    const BORDER_LIGHT = [226, 232, 240];

    // Top Bar
    doc.setFillColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.rect(0, 0, W, 12, 'F');

    // Accent Line
    doc.setFillColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
    doc.rect(0, 12, W, 1.5, 'F');

    // Title
    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Smile Gallery - Before & After Transformation', 15, 25);

    // Image (square 1080x1080 -> 160mm x 160mm)
    doc.addImage(smileGalleryDataUrl, 'JPEG', 25, 32, 160, 160);

    // Footer
    const footerY = 270;
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 15, W - 15, footerY - 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('This is a digitally generated prescription/receipt. No physical signature is required.', 15, footerY - 5);
    doc.text(`${clinicInfo.clinicName} · Thank you for letting us care for your smile.`, 15, footerY);
  } catch (e) {
    console.error("Failed to generate or add Smile Gallery to PDF:", e);
  }
};
