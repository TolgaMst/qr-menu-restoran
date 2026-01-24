"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Phone,
  MapPin,
  Clock,
  QrCode,
  Home,
  Download,
  Upload,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSelector from "@/components/ThemeSelector";
import { Language, getTranslation, translations } from "@/lib/translations";
import { ThemeColors, loadTheme, saveTheme, applyTheme } from "@/lib/theme";
import { Currency, currencies, loadCurrency, saveCurrency } from "@/lib/currency";
import {
  hasAdminPassword,
  checkAdminPassword,
  setAdminPassword
} from "@/lib/auth";
import { Lock, LogOut } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
  image?: string;
  items: MenuItem[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Restoranım",
    phone: "+90 (555) 123 45 67",
    address: "Örnek Mahalle, Örnek Sokak No:1",
    hours: "Pazartesi - Pazar: 09:00 - 23:00",
    logo: "",
    welcomeMessage: "",
    location: "",
    email: "",
    instagram: "",
    facebook: "",
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "info" | "theme" | "currency">("menu");
  const [language, setLanguage] = useState<Language>("tr");
  const [theme, setTheme] = useState<ThemeColors>(loadTheme());
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>(loadCurrency());
  // GitHub ayarları - kod içine entegre edildi
  const GITHUB_USERNAME = "TolgaMst";
  const GITHUB_REPO = "qr-menu-restoran";
  // Token sadece environment variable'dan alınır (Cloudflare Pages'de ayarlanmalı)
  const getGithubToken = () => {
    if (typeof window !== "undefined") {
      // Environment variable'dan token'ı al (build time'da Cloudflare Pages'de ayarlanmalı)
      const envToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      console.log("🔍 Token kontrolü:", {
        hasToken: !!envToken,
        tokenLength: envToken?.length || 0,
        tokenPrefix: envToken?.substring(0, 4) || "none"
      });
      return envToken || "";
    }
    return "";
  };

  useEffect(() => {
    // İlk yüklemede şifre kontrolü yap
    if (typeof window !== "undefined") {
      if (!hasAdminPassword()) {
        setIsFirstTime(true);
      } else {
        // Şifre varsa, session'dan kontrol et
        const sessionAuth = sessionStorage.getItem("adminAuthenticated");
        if (sessionAuth === "true") {
          setIsAuthenticated(true);
        }
      }

    }
  }, []);

  useEffect(() => {
    // Önce public/data.json dosyasından verileri yükle (tüm cihazlar için tek kaynak)
    const loadData = async () => {
      try {
        const response = await fetch("/data.json");
        if (response.ok) {
          const data = await response.json();

          console.log("📥 Admin paneli: public/data.json'dan veriler yükleniyor...");

          // Önce public/data.json'dan tüm verileri yükle
          if (data.restaurantInfo) {
            setRestaurantInfo(data.restaurantInfo);
            console.log("✅ Restoran bilgileri data.json'dan yüklendi");
          }

          if (data.menuData && Array.isArray(data.menuData) && data.menuData.length > 0) {
            setCategories(data.menuData);
            console.log("✅ Menü verileri yüklendi:", data.menuData.length, "kategori");
          }

          if (data.language && (data.language === "tr" || data.language === "en")) {
            setLanguage(data.language);
            console.log("✅ Dil yüklendi:", data.language);
          }

          if (data.currency) {
            setDefaultCurrency(data.currency);
            saveCurrency(data.currency);
            console.log("✅ Para birimi yüklendi:", data.currency);
          }

          if (data.theme) {
            setTheme(data.theme);
            saveTheme(data.theme);
            applyTheme(data.theme);
            console.log("✅ Tema yüklendi");
          }
        }
      } catch (error) {
        console.log("⚠️ Admin paneli: public/data.json bulunamadı veya hata oluştu");
      }

      // LocalStorage'dan verileri yükle (sadece admin panelinde override için)
      // Bu sayede admin panelinde yapılan değişiklikler kaybolmaz
      const savedInfo = localStorage.getItem("restaurantInfo");
      if (savedInfo) {
        try {
          const parsedInfo = JSON.parse(savedInfo);
          setRestaurantInfo(parsedInfo);
          console.log("✅ Restoran bilgileri LocalStorage'dan override edildi (admin paneli değişiklikleri)");
        } catch (e) {
          console.error("❌ LocalStorage'dan restoran bilgileri parse edilemedi:", e);
        }
      }

      const savedMenu = localStorage.getItem("menuData");
      if (savedMenu) {
        try {
          setCategories(JSON.parse(savedMenu));
          console.log("✅ Menü verileri LocalStorage'dan override edildi (admin paneli değişiklikleri)");
        } catch (e) {
          console.error("❌ LocalStorage'dan menü verileri parse edilemedi:", e);
        }
      }

      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
        setLanguage(savedLanguage);
      }

      // Tema yükle
      const loadedTheme = loadTheme();
      if (loadedTheme) {
        setTheme(loadedTheme);
      }
    };

    loadData();
  }, []);

  // exportTimeoutRef kaldırıldı - artık manuel push kullanılıyor

  // GitHub'a push fonksiyonu
  const pushToGitHub = async (dataStr: string) => {
    const githubToken = getGithubToken();

    if (!githubToken) {
      console.error("❌ GitHub token eksik!");
      alert(
        language === "tr"
          ? "❌ GitHub token eksik! Lütfen Cloudflare Pages'de environment variable olarak NEXT_PUBLIC_GITHUB_TOKEN ekleyin.\n\nCloudflare Pages → Settings → Environment Variables → NEXT_PUBLIC_GITHUB_TOKEN"
          : "❌ GitHub token missing! Please add NEXT_PUBLIC_GITHUB_TOKEN as environment variable in Cloudflare Pages.\n\nCloudflare Pages → Settings → Environment Variables → NEXT_PUBLIC_GITHUB_TOKEN"
      );
      return false;
    }

    try {
      console.log("🔄 GitHub'a push ediliyor...");

      // Önce mevcut dosyayı oku (SHA için)
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/public/data.json`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      let sha: string | null = null;
      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
        console.log("📄 Mevcut dosya bulundu, güncelleniyor...");
      } else if (getFileResponse.status === 404) {
        // Dosya yoksa, yeni dosya oluştur (SHA gönderme)
        console.log("📄 Dosya bulunamadı, yeni dosya oluşturuluyor...");
        sha = null;
      } else {
        // Diğer hatalar
        const error = await getFileResponse.json().catch(() => ({ message: "Unknown error" }));
        console.error("❌ Dosya okuma hatası:", error);
        const errorMessage = error.message || JSON.stringify(error);
        alert(
          language === "tr"
            ? `❌ GitHub dosya okuma hatası!\n\nHata: ${errorMessage}\n\nLütfen repository'nin mevcut olduğundan ve token'ın doğru olduğundan emin olun.`
            : `❌ GitHub file read error!\n\nError: ${errorMessage}\n\nPlease make sure the repository exists and the token is correct.`
        );
        return false;
      }

      // Dosyayı base64 encode et
      const base64Content = btoa(unescape(encodeURIComponent(dataStr)));

      // Request body'yi hazırla
      const requestBody: any = {
        message: `Auto-update: data.json - ${new Date().toISOString()}`,
        content: base64Content,
        branch: "main",
      };

      // Sadece dosya varsa (sha varsa) SHA'yı ekle
      if (sha) {
        requestBody.sha = sha;
      }

      // Dosyayı güncelle veya oluştur
      const updateResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/public/data.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (updateResponse.ok) {
        const result = await updateResponse.json();
        console.log("✅ GitHub'a otomatik push başarılı!", result.commit.html_url);
        alert(language === "tr"
          ? "✅ GitHub'a başarıyla push edildi! 2-3 dakika içinde tüm cihazlarda görünecek."
          : "✅ Successfully pushed to GitHub! Will be visible on all devices in 2-3 minutes.");
        return true;
      } else if (updateResponse.status === 409) {
        // 409 Conflict: SHA eşleşmiyor, dosya başka biri tarafından değiştirilmiş
        // Dosyayı tekrar okuyup güncel SHA ile tekrar dene
        console.log("⚠️ 409 Conflict - Dosya güncellenmiş, güncel SHA ile tekrar deneniyor...");

        try {
          const retryGetResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/public/data.json`,
            {
              headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );

          if (retryGetResponse.ok) {
            const retryFileData = await retryGetResponse.json();
            const retrySha = retryFileData.sha;

            // Güncel SHA ile tekrar dene
            const retryUpdateResponse = await fetch(
              `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/public/data.json`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${githubToken}`,
                  Accept: "application/vnd.github.v3+json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message: `Auto-update: data.json - ${new Date().toISOString()}`,
                  content: base64Content,
                  sha: retrySha,
                  branch: "main",
                }),
              }
            );

            if (retryUpdateResponse.ok) {
              const result = await retryUpdateResponse.json();
              console.log("✅ GitHub'a otomatik push başarılı! (Retry)", result.commit.html_url);
              alert(language === "tr"
                ? "✅ GitHub'a başarıyla push edildi! (Retry ile) 2-3 dakika içinde tüm cihazlarda görünecek."
                : "✅ Successfully pushed to GitHub! (Retry) Will be visible on all devices in 2-3 minutes.");
              return true;
            } else {
              const retryError = await retryUpdateResponse.json().catch(() => ({ message: "Unknown error" }));
              const retryErrorMessage = retryError.message || retryError.error || JSON.stringify(retryError);
              console.error("❌ Retry push hatası:", retryError);
              console.error("Retry hata detayları:", {
                status: retryUpdateResponse.status,
                error: retryErrorMessage,
              });

              // Retry de başarısız olursa kullanıcıya bildir
              alert(
                language === "tr"
                  ? `❌ GitHub push hatası (Retry başarısız)!\n\nHata: ${retryErrorMessage}\n\nLütfen birkaç saniye bekleyip tekrar deneyin.`
                  : `❌ GitHub push error (Retry failed)!\n\nError: ${retryErrorMessage}\n\nPlease wait a few seconds and try again.`
              );
              return false;
            }
          } else {
            const retryReadError = await retryGetResponse.json().catch(() => ({ message: "Unknown error" }));
            console.error("❌ Retry dosya okuma hatası:", retryReadError);
            return false;
          }
        } catch (retryError: any) {
          const retryErrorMessage = retryError.message || retryError.toString() || "Unknown error";
          console.error("❌ Retry exception:", retryError);
          console.error("Retry exception mesajı:", retryErrorMessage);
          return false;
        }
      } else {
        const error = await updateResponse.json().catch(() => ({ message: "Unknown error" }));
        const errorMessage = error.message || error.error || JSON.stringify(error);
        console.error("❌ GitHub push hatası:", error);
        console.error("Hata detayları:", {
          status: updateResponse.status,
          statusText: updateResponse.statusText,
          error: errorMessage,
          url: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}`,
        });

        // Kullanıcıya detaylı hata mesajı göster (409 hariç - o zaten retry edildi)
        if (updateResponse.status !== 409) {
          alert(
            language === "tr"
              ? `❌ GitHub push hatası!\n\nHata: ${errorMessage}\n\nLütfen şunları kontrol edin:\n1. Token geçerli mi?\n2. Repository adı doğru mu?\n3. Token'ın "repo" izni var mı?\n\nConsole'da daha fazla detay görebilirsiniz (F12).`
              : `❌ GitHub push error!\n\nError: ${errorMessage}\n\nPlease check:\n1. Is token valid?\n2. Is repository name correct?\n3. Does token have "repo" permission?\n\nSee console (F12) for more details.`
          );
        }
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || error.toString() || "Unknown error";
      console.error("❌ GitHub push exception:", error);
      console.error("Hata mesajı:", errorMessage);

      // Kullanıcıya hata mesajı göster
      alert(
        language === "tr"
          ? `❌ GitHub push hatası!\n\nHata: ${errorMessage}\n\nLütfen şunları kontrol edin:\n1. İnternet bağlantınız var mı?\n2. GitHub ayarları doğru mu?\n3. Console'da daha fazla detay var (F12).`
          : `❌ GitHub push error!\n\nError: ${errorMessage}\n\nPlease check:\n1. Do you have internet connection?\n2. Are GitHub settings correct?\n3. See console (F12) for more details.`
      );
      return false;
    }
  };

  // exportDataJson fonksiyonu kaldırıldı - artık sadece "Kaydet ve GitHub'a Push Et" butonu kullanılıyor

  const saveToLocalStorage = (data: Category[]) => {
    localStorage.setItem("menuData", JSON.stringify(data));
    // Otomatik push kaldırıldı - sadece "Kaydet" butonuna basıldığında push edilecek
  };

  const saveInfoToLocalStorage = (info: typeof restaurantInfo) => {
    localStorage.setItem("restaurantInfo", JSON.stringify(info));
    // Otomatik push kaldırıldı - sadece "Kaydet" butonuna basıldığında push edilecek
  };

  // Manuel push fonksiyonu - "Kaydet" butonuna basıldığında çağrılacak
  const handleSaveAndPush = async () => {
    const githubToken = getGithubToken();

    if (!githubToken) {
      alert(
        language === "tr"
          ? "❌ GitHub token eksik! Lütfen Cloudflare Pages'de environment variable olarak NEXT_PUBLIC_GITHUB_TOKEN ekleyin.\n\nCloudflare Pages → Settings → Environment Variables → NEXT_PUBLIC_GITHUB_TOKEN"
          : "❌ GitHub token missing! Please add NEXT_PUBLIC_GITHUB_TOKEN as environment variable in Cloudflare Pages.\n\nCloudflare Pages → Settings → Environment Variables → NEXT_PUBLIC_GITHUB_TOKEN"
      );
      return;
    }

    const publicData = {
      menuData: categories,
      restaurantInfo: restaurantInfo,
      theme: theme,
      currency: defaultCurrency,
      language: language,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(publicData, null, 2);

    console.log("💾 Kaydediliyor ve GitHub'a push ediliyor...");
    const pushed = await pushToGitHub(dataStr);

    if (pushed) {
      // Başarılı - alert zaten pushToGitHub içinde gösteriliyor
      console.log("✅ Tüm değişiklikler kaydedildi ve GitHub'a push edildi!");
    } else {
      console.error("❌ Push başarısız!");
    }
  };

  const handleBackup = () => {
    const backupData = {
      menuData: categories,
      restaurantInfo: restaurantInfo,
      theme: theme,
      currency: defaultCurrency,
      language: language,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-menu-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(getTranslation(language, "backupSuccess"));
  };

  const handleRestore = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const backupData = JSON.parse(event.target?.result as string);

          // Verileri geri yükle
          if (backupData.menuData) {
            setCategories(backupData.menuData);
            saveToLocalStorage(backupData.menuData);
          }
          if (backupData.restaurantInfo) {
            setRestaurantInfo(backupData.restaurantInfo);
            saveInfoToLocalStorage(backupData.restaurantInfo);
          }
          if (backupData.theme) {
            setTheme(backupData.theme);
            saveTheme(backupData.theme);
          }
          if (backupData.currency) {
            setDefaultCurrency(backupData.currency);
            saveCurrency(backupData.currency);
          }
          if (backupData.language) {
            setLanguage(backupData.language);
            localStorage.setItem("language", backupData.language);
          }

          alert(getTranslation(language, "restoreSuccess"));
          window.location.reload(); // Sayfayı yenile
        } catch (error) {
          alert(getTranslation(language, "restoreError"));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const [newCategoryImage, setNewCategoryImage] = useState("");

  // Varsayılan menüyü yükle fonksiyonu
  const loadDefaultMenu = () => {
    let itemIdCounter = 1;
    const createItem = (name: string, price: number, categoryId: string, description?: string) => {
      return {
        id: (itemIdCounter++).toString(),
        name,
        price,
        description,
        category: categoryId,
      };
    };

    const defaultMenu: Category[] = [
      {
        id: "1",
        name: "MEZELER",
        items: [
          createItem("Molehiya", 200, "1"),
          createItem("Fix Meze", 650, "1", "Siz istediğiniz sürece ücretsiz yenileniyor :)"),
          createItem("Ezine Peyniri", 200, "1"),
          createItem("Tulum Peyniri", 200, "1"),
          createItem("Süzme Yoğurt", 150, "1"),
          createItem("Haydari", 165, "1"),
          createItem("Atom", 160, "1"),
          createItem("Havuç Tarator", 165, "1"),
          createItem("Ispanak", 150, "1"),
          createItem("Şakşuka", 175, "1"),
          createItem("Babagannuş", 175, "1"),
          createItem("Humus", 180, "1", "Zeytinyağlı"),
          createItem("Humus", 200, "1", "Tereyağlı"),
          createItem("Humus", 200, "1", "Kaşarlı"),
          createItem("Humus", 275, "1", "Pastırmalı"),
          createItem("Rus Salatası", 200, "1"),
          createItem("Yeşil Zeytin", 165, "1"),
          createItem("Pancar", 170, "1"),
          createItem("Börülce", 180, "1"),
          createItem("Cacık", 165, "1"),
          createItem("Söğüş", 150, "1"),
          createItem("Mexico Fasulyesi", 200, "1"),
          createItem("Kaya Koruğu", 185, "1"),
          createItem("Barbunya Pilaki", 200, "1"),
          createItem("Brokoli", 185, "1"),
          createItem("Tahin Tarator", 185, "1"),
          createItem("Muhammara", 225, "1"),
          createItem("Çubuk Turşu", 150, "1"),
          createItem("Biber Yoğurtlama", 180, "1"),
          createItem("Dillere Destan", 200, "1"),
          createItem("Peynirli Kiraz Biber", 185, "1"),
          createItem("Yoğurtlu Patlıcan", 180, "1"),
        ],
      },
      {
        id: "2",
        name: "Çiğ Köfte",
        items: [
          createItem("Çiğ Köfte", 200, "2"),
          createItem("Peynir Tabağı", 260, "2"),
          createItem("Akdeniz", 190, "2"),
          createItem("Girit Ezmesi", 225, "2"),
          createItem("Cevizli Kuru Domates", 225, "2"),
        ],
      },
      {
        id: "3",
        name: "ARA SICAK",
        items: [
          createItem("Güveçte Yaprak Ciğer", 300, "3"),
          createItem("Ali Nazik", 350, "3"),
          createItem("Kiremitte Dana Dili", 275, "3"),
          createItem("Dana Dili Söğüş", 275, "3"),
          createItem("Kiremitte Kaşarlı Mantar", 200, "3"),
          createItem("Kızarmış Hellim Peyniri (Porsiyon)", 260, "3"),
          createItem("Köylü Cips", 225, "3"),
          createItem("Parmak Cips", 160, "3"),
          createItem("İçli Köfte", 100, "3"),
          createItem("Sigara Böreği (Porsiyon)", 150, "3"),
        ],
      },
      {
        id: "4",
        name: "SALATA",
        items: [
          createItem("Roka Salata", 200, "4"),
          createItem("Mevsim Salata", 200, "4"),
          createItem("Çoban Salata", 200, "4"),
          createItem("Zeytin Salata", 225, "4"),
          createItem("Kaşık Salata", 200, "4"),
          createItem("Gavurdağı Salata", 250, "4"),
          createItem("Sezar Salata", 400, "4"),
        ],
      },
      {
        id: "5",
        name: "ANA YEMEKLER",
        items: [
          createItem("Kebab", 450, "5"),
          createItem("Kuşbaşı", 500, "5"),
          createItem("Pirzola", 650, "5"),
          createItem("Köfte", 450, "5"),
          createItem("Tavuk Kanat", 425, "5"),
          createItem("Tavuk Şiş", 400, "5"),
          createItem("Tereyağlı Tavuk", 450, "5"),
          createItem("Tavuk Güveç", 550, "5"),
          createItem("Sac Kavurma", 600, "5"),
          createItem("Kara Kavurma", 600, "5"),
          createItem("Bonfile", 700, "5"),
          createItem("Bonfile Sarma", 800, "5"),
          createItem("Karışık Izgara (2 Kişilik)", 750, "5"),
          createItem("Enfes Lokum", 750, "5"),
          createItem("Kaşarlı Köfte", 475, "5"),
          createItem("Beyti Kebab", 570, "5"),
          createItem("Kazbaşı", 575, "5"),
          createItem("Antrikot", 660, "5"),
          createItem("Tornado", 750, "5"),
          createItem("Patlıcan Kebabı", 500, "5"),
          createItem("Hawai Steak", 675, "5"),
          createItem("Diana Steak", 675, "5"),
          createItem("Şeftali Kebabı", 475, "5"),
        ],
      },
      {
        id: "6",
        name: "DENIZDEN",
        items: [
          createItem("Karides Güveç", 475, "6"),
          createItem("Kalamar", 475, "6"),
          createItem("Izgara Levrek", 600, "6"),
          createItem("Izgara Çipura", 600, "6"),
          createItem("Sebzeli Norveç Somonu", 500, "6"),
        ],
      },
      {
        id: "7",
        name: "MEYVE",
        items: [
          createItem("Serpme Meyve", 250, "7"),
          createItem("Meyve Tabağı", 150, "7"),
          createItem("Meyve Atom", 120, "7"),
          createItem("Kıbrıs Tatlısı", 630, "7"),
        ],
      },
      {
        id: "8",
        name: "ALKOLLÜ İÇECEKLER",
        items: [
          createItem("Yeni Rakı 35CL", 625, "8"),
          createItem("Yeni Rakı 50CL", 860, "8"),
          createItem("Yeni Rakı 70CL", 1095, "8"),
          createItem("Yeni Rakı 100CL", 1425, "8"),
          createItem("Yeni Rakı Yeni Seri 35CL", 675, "8"),
          createItem("Yeni Rakı Yeni Seri 50CL", 950, "8"),
          createItem("Yeni Rakı Yeni Seri 70CL", 1225, "8"),
          createItem("Yeni Rakı Yeni Seri 100CL", 1600, "8"),
          createItem("Efe Gold 35CL", 795, "8"),
          createItem("Efe Gold 50CL", 1095, "8"),
          createItem("Efe Gold 70CL", 1225, "8"),
          createItem("Efe Gold 100CL", 1725, "8"),
          createItem("Tekirdağ Altınseri 20CL", 600, "8"),
          createItem("Tekirdağ Altınseri 35CL", 795, "8"),
          createItem("Tekirdağ Altınseri 50CL", 1095, "8"),
          createItem("Tekirdağ Altınseri 70CL", 1375, "8"),
          createItem("Tekirdağ Altınseri 100CL", 1725, "8"),
          createItem("Beylerbeyi Göbek 35CL", 945, "8"),
          createItem("Beylerbeyi Göbek 50CL", 1310, "8"),
          createItem("Beylerbeyi Göbek 70CL", 1695, "8"),
          createItem("Beylerbeyi Göbek 100CL", 2175, "8"),
          createItem("Tekirdağ Yaş Üzüm 35CL", 665, "8"),
          createItem("Tekirdağ Yaş Üzüm 50CL", 935, "8"),
          createItem("Tekirdağ Yaş Üzüm 70CL", 1175, "8"),
          createItem("Tekirdağ Yaş Üzüm 100CL", 1565, "8"),
          createItem("Efes Malt", 250, "8"),
          createItem("Efes Özel Seri", 250, "8"),
          createItem("Chivas 35CL", 1350, "8"),
          createItem("Chivas 50CL", 1900, "8"),
          createItem("Chivas 70CL", 2450, "8"),
          createItem("Shivas 100CL", 3350, "8"),
        ],
      },
      {
        id: "9",
        name: "SOĞUK İÇECEK",
        items: [
          createItem("Meşrubat", 90, "9"),
          createItem("Coca Cola", 90, "9"),
          createItem("Coca Cola Zero", 90, "9"),
          createItem("Fanta", 90, "9"),
          createItem("Ice Tea", 90, "9"),
          createItem("Sprite", 90, "9"),
          createItem("Şalgam (Küçük)", 75, "9"),
          createItem("Şalgam (Büyük)", 125, "9"),
          createItem("Soda", 50, "9"),
          createItem("Ayran", 50, "9"),
          createItem("Su", 75, "9"),
        ],
      },
    ];

    setCategories(defaultMenu);
    saveToLocalStorage(defaultMenu);
    alert(language === "tr"
      ? "✅ Varsayılan menü başarıyla yüklendi! (9 kategori, 150+ ürün)"
      : "✅ Default menu loaded successfully! (9 categories, 150+ products)");
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      image: newCategoryImage || undefined,
      items: [],
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    saveToLocalStorage(updated);
    setNewCategoryName("");
    setNewCategoryImage("");
  };

  const updateCategory = (id: string, name: string) => {
    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, name } : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
    setEditingCategory(null);
  };

  const updateCategoryImage = (id: string, image: string) => {
    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, image: image || undefined } : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
  };

  const deleteCategory = (id: string) => {
    if (confirm(getTranslation(language, "deleteCategoryConfirm"))) {
      const updated = categories.filter((cat) => cat.id !== id);
      setCategories(updated);
      saveToLocalStorage(updated);
    }
  };

  const addItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: getTranslation(language, "newProduct"),
      description: "",
      price: 0,
      category: categoryId,
    };

    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, items: [...cat.items, newItem] }
        : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
    setEditingItem(newItem.id);
  };

  const updateItem = (
    categoryId: string,
    itemId: string,
    updates: Partial<MenuItem>
  ) => {
    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }
        : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    if (confirm(getTranslation(language, "deleteProductConfirm"))) {
      const updated = categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      );
      setCategories(updated);
      saveToLocalStorage(updated);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleThemeChange = (newTheme: ThemeColors) => {
    setTheme(newTheme);
    saveTheme(newTheme);
    // Otomatik push kaldırıldı - sadece "Kaydet" butonuna basıldığında push edilecek
  };

  const getCurrentUrl = () => {
    // QR kod her zaman production URL'sine işaret etmeli
    return "https://mezecim.net";
  };

  const handleFirstTimeSetup = () => {
    if (!password.trim()) {
      setPasswordError(getTranslation(language, "passwordRequired"));
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError(getTranslation(language, "passwordMismatch"));
      return;
    }
    setAdminPassword(password);
    setIsFirstTime(false);
    setIsAuthenticated(true);
    sessionStorage.setItem("adminAuthenticated", "true");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleLogin = () => {
    if (!loginPassword.trim()) {
      setPasswordError(getTranslation(language, "passwordRequired"));
      return;
    }
    if (checkAdminPassword(loginPassword)) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      setLoginPassword("");
      setPasswordError("");
    } else {
      setPasswordError(getTranslation(language, "wrongPassword"));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuthenticated");
    setLoginPassword("");
  };

  // Şifre ekranı - Klasik Meyhane Teması
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-950 via-wood-900 to-primary-950 flex items-center justify-center px-4">
        <div className="vintage-frame bg-wood-900/90 backdrop-blur-sm p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gold-400">
              <Lock className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-2xl font-display font-bold text-cream-100 mb-2">
              {isFirstTime
                ? getTranslation(language, "firstTimeSetup")
                : getTranslation(language, "adminPanel")}
            </h1>
            <p className="text-cream-400 text-sm font-body">
              {isFirstTime
                ? getTranslation(language, "firstTimeSetupDescription")
                : getTranslation(language, "enterPassword")}
            </p>
          </div>

          {isFirstTime ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream-200 mb-2 font-body">
                  {getTranslation(language, "setPassword")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleFirstTimeSetup()}
                  className="w-full px-4 py-3 bg-wood-800/80 border border-gold-400/30 rounded-lg text-cream-100 placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 font-body"
                  placeholder={getTranslation(language, "password")}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream-200 mb-2 font-body">
                  {getTranslation(language, "confirmPassword")}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleFirstTimeSetup()}
                  className="w-full px-4 py-3 bg-wood-800/80 border border-gold-400/30 rounded-lg text-cream-100 placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 font-body"
                  placeholder={getTranslation(language, "confirmPassword")}
                />
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm font-body">{passwordError}</p>
              )}
              <button
                onClick={handleFirstTimeSetup}
                className="w-full px-4 py-3 bg-primary-600 text-cream-100 rounded-lg hover:bg-primary-500 transition font-display font-semibold border border-gold-400/50"
              >
                {getTranslation(language, "setPassword")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream-200 mb-2 font-body">
                  {getTranslation(language, "password")}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full px-4 py-3 bg-wood-800/80 border border-gold-400/30 rounded-lg text-cream-100 placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 font-body"
                  placeholder={getTranslation(language, "enterPassword")}
                  autoFocus
                />
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm font-body">{passwordError}</p>
              )}
              <button
                onClick={handleLogin}
                className="w-full px-4 py-3 bg-primary-600 text-cream-100 rounded-lg hover:bg-primary-500 transition font-display font-semibold border border-gold-400/50"
              >
                {getTranslation(language, "login")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-950 to-wood-900">
      {/* Header */}
      <header className="bg-wood-900/95 backdrop-blur-sm border-b border-gold-400/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-cream-100">
              {getTranslation(language, "adminPanel")}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-cream-100 rounded-lg hover:bg-primary-500 transition text-sm sm:text-base border border-gold-400/50"
              >
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
                <span className="hidden sm:inline">{getTranslation(language, "showQRCode")}</span>
              </button>
              <a
                href="/"
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-wood-800 text-cream-200 rounded-lg hover:bg-wood-700 transition text-sm sm:text-base border border-gold-400/30"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
                <span className="hidden sm:inline">{getTranslation(language, "viewMenu")}</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-800/50 transition text-sm sm:text-base border border-red-500/30"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{getTranslation(language, "logout")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="vintage-frame bg-wood-900/95 p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-display font-bold text-cream-100">
                {getTranslation(language, "qrCode")}
              </h2>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-cream-400 hover:text-cream-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gold-400">
                <QRCodeSVG value={getCurrentUrl()} size={256} />
              </div>
              <p className="text-cream-400 text-center font-body">
                {getTranslation(language, "qrCodeDescription")}
              </p>
              <a
                href={getCurrentUrl()}
                className="text-gold-400 hover:text-gold-300 text-sm font-body"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getCurrentUrl()}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Tabs */}
        <div className="vintage-frame bg-wood-900/80 backdrop-blur-sm mb-4 sm:mb-6 overflow-x-auto">
          <div className="flex border-b border-gold-400/30 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-display font-medium text-sm sm:text-base whitespace-nowrap transition ${activeTab === "menu"
                ? "text-gold-400 border-b-2 border-gold-400"
                : "text-cream-400 hover:text-cream-200"
                }`}
            >
              {getTranslation(language, "menuManagement")}
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-display font-medium text-sm sm:text-base whitespace-nowrap transition ${activeTab === "info"
                ? "text-gold-400 border-b-2 border-gold-400"
                : "text-cream-400 hover:text-cream-200"
                }`}
            >
              {getTranslation(language, "restaurantInfo")}
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-display font-medium text-sm sm:text-base whitespace-nowrap transition ${activeTab === "theme"
                ? "text-gold-400 border-b-2 border-gold-400"
                : "text-cream-400 hover:text-cream-200"
                }`}
            >
              {getTranslation(language, "themeSettings")}
            </button>
            <button
              onClick={() => setActiveTab("currency")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-display font-medium text-sm sm:text-base whitespace-nowrap transition ${activeTab === "currency"
                ? "text-gold-400 border-b-2 border-gold-400"
                : "text-cream-400 hover:text-cream-200"
                }`}
            >
              {getTranslation(language, "currencySettings")}
            </button>
          </div>
        </div>

        {/* Menu Management */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            {/* Varsayılan Menüyü Yükle Butonu */}
            <div className="vintage-frame bg-primary-900/30 p-4 border-2 border-primary-400/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-1">
                    {language === "tr" ? "📋 Varsayılan Menüyü Yükle" : "📋 Load Default Menu"}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {language === "tr"
                      ? "PDF'den eklenen tüm ürünleri (9 kategori, 150+ ürün) yüklemek için bu butona basın."
                      : "Click this button to load all products from PDF (9 categories, 150+ products)."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(language === "tr"
                      ? "Varsayılan menüyü yüklemek istediğinize emin misiniz? Mevcut menü verileri silinecek!"
                      : "Are you sure you want to load the default menu? Current menu data will be deleted!")) {
                      loadDefaultMenu();
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
                >
                  {language === "tr" ? "🔄 Varsayılan Menüyü Yükle" : "🔄 Load Default Menu"}
                </button>
              </div>
            </div>

            {/* Add Category */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCategory()}
                    placeholder={getTranslation(language, "newCategoryPlaceholder")}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={addCategory}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{getTranslation(language, "addCategory")}</span>
                  </button>
                </div>
                {/* Kategori Resmi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation(language, "imageUrl")} {getTranslation(language, "optional")}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64String = reader.result as string;
                            setNewCategoryImage(base64String);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      {getTranslation(language, "orUseUrl")}
                    </p>
                    <input
                      type="url"
                      value={newCategoryImage?.startsWith("data:") ? "" : (newCategoryImage || "")}
                      onChange={(e) => setNewCategoryImage(e.target.value)}
                      placeholder={getTranslation(language, "imageUrlPlaceholder")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {newCategoryImage && (
                      <div className="mt-2">
                        <img
                          src={newCategoryImage}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {editingCategory === category.id ? (
                        <input
                          type="text"
                          defaultValue={category.name}
                          onBlur={(e) =>
                            updateCategory(category.id, e.target.value)
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              updateCategory(
                                category.id,
                                (e.target as HTMLInputElement).value
                              );
                            }
                          }}
                          autoFocus
                          className="text-xl font-bold px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <h2 className="text-xl font-bold text-gray-900">
                          {category.name}
                        </h2>
                      )}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setEditingCategory(
                              editingCategory === category.id ? null : category.id
                            )
                          }
                          className="p-2 text-gray-600 hover:text-primary-600 transition"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => addItem(category.id)}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{getTranslation(language, "addProduct")}</span>
                        </button>
                      </div>
                    </div>
                    {/* Kategori Resmi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation(language, "imageUrl")} {getTranslation(language, "optional")}
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64String = reader.result as string;
                                updateCategoryImage(category.id, base64String);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          {getTranslation(language, "orUseUrl")}
                        </p>
                        <input
                          type="url"
                          defaultValue={category.image?.startsWith("data:") ? "" : (category.image || "")}
                          onChange={(e) => updateCategoryImage(category.id, e.target.value)}
                          placeholder={getTranslation(language, "imageUrlPlaceholder")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {category.image && (
                          <div className="mt-2">
                            <img
                              src={category.image}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        {editingItem === item.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getTranslation(language, "productName")}
                              </label>
                              <input
                                type="text"
                                defaultValue={item.name}
                                onChange={(e) =>
                                  updateItem(category.id, item.id, {
                                    name: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getTranslation(language, "description")}
                              </label>
                              <textarea
                                defaultValue={item.description || ""}
                                onChange={(e) =>
                                  updateItem(category.id, item.id, {
                                    description: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getTranslation(language, "price")} (₺)
                              </label>
                              <input
                                type="number"
                                defaultValue={item.price}
                                onChange={(e) =>
                                  updateItem(category.id, item.id, {
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                step="0.01"
                              />
                            </div>
                            {/* Ürün resimleri kaldırıldı - sadece kategorilere resim eklenebilir */}
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingItem(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                              >
                                {getTranslation(language, "save")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-gray-600 text-sm mt-1">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-primary-600 font-bold mt-2">
                                {item.price.toFixed(2)} ₺
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingItem(item.id)}
                                className="p-2 text-gray-600 hover:text-primary-600 transition"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteItem(category.id, item.id)}
                                className="p-2 text-gray-600 hover:text-red-600 transition"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {category.items.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        {getTranslation(language, "noProductsInCategory")} {getTranslation(language, "addProduct")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Kaydet Butonu */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <button
                onClick={handleSaveAndPush}
                className="w-full px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5" />
                <span>{language === "tr" ? "💾 Kaydet ve GitHub'a Push Et" : "💾 Save and Push to GitHub"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Restaurant Info */}
        {activeTab === "info" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* GitHub Token Bilgilendirme */}
            {!getGithubToken() && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  {language === "tr" ? "⚠️ GitHub Token Gerekli" : "⚠️ GitHub Token Required"}
                </h3>
                <p className="text-sm text-yellow-700 mb-2">
                  {language === "tr"
                    ? "GitHub'a push yapabilmek için token gerekir. Token Cloudflare Pages'de environment variable olarak ayarlanmalıdır."
                    : "Token is required to push to GitHub. Token must be set as environment variable in Cloudflare Pages."}
                </p>
                <p className="text-xs text-yellow-600">
                  {language === "tr"
                    ? "Cloudflare Pages → Settings → Environment Variables → NEXT_PUBLIC_GITHUB_TOKEN ekleyin"
                    : "Cloudflare Pages → Settings → Environment Variables → Add NEXT_PUBLIC_GITHUB_TOKEN"}
                </p>
              </div>
            )}

            {/* Kaydet Butonu */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <button
                onClick={handleSaveAndPush}
                className="w-full px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5" />
                <span>{language === "tr" ? "💾 Kaydet ve GitHub'a Push Et" : "💾 Save and Push to GitHub"}</span>
              </button>
            </div>

            {/* Yedekleme ve Geri Yükleme */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getTranslation(language, "backup")} / {getTranslation(language, "restore")}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {getTranslation(language, "backupDescription")}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBackup}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{getTranslation(language, "backup")}</span>
                </button>
                <button
                  onClick={handleRestore}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>{getTranslation(language, "restore")}</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "restaurantName")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.name}
                  onChange={(e) => {
                    const updated = { ...restaurantInfo, name: e.target.value };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "phone")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.phone}
                  onChange={(e) => {
                    const updated = {
                      ...restaurantInfo,
                      phone: e.target.value,
                    };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "address")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.address}
                  onChange={(e) => {
                    const updated = {
                      ...restaurantInfo,
                      address: e.target.value,
                    };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "hours")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.hours}
                  onChange={(e) => {
                    const updated = {
                      ...restaurantInfo,
                      hours: e.target.value,
                    };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "location")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.location || ""}
                  onChange={(e) => {
                    const updated = {
                      ...restaurantInfo,
                      location: e.target.value,
                    };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  placeholder={getTranslation(language, "locationPlaceholder")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {getTranslation(language, "optional")} - Google Maps linki ekleyin
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "email")}
                </label>
                <input
                  type="email"
                  value={restaurantInfo.email || ""}
                  onChange={(e) => {
                    const updated = {
                      ...restaurantInfo,
                      email: e.target.value,
                    };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  placeholder="info@restoran.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {getTranslation(language, "optional")}
                </p>
              </div>
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {getTranslation(language, "socialMedia")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={restaurantInfo.instagram || ""}
                      onChange={(e) => {
                        const updated = {
                          ...restaurantInfo,
                          instagram: e.target.value,
                        };
                        setRestaurantInfo(updated);
                        saveInfoToLocalStorage(updated);
                      }}
                      placeholder="https://instagram.com/restoran"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {getTranslation(language, "optional")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={restaurantInfo.facebook || ""}
                      onChange={(e) => {
                        const updated = {
                          ...restaurantInfo,
                          facebook: e.target.value,
                        };
                        setRestaurantInfo(updated);
                        saveInfoToLocalStorage(updated);
                      }}
                      placeholder="https://facebook.com/restoran"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {getTranslation(language, "optional")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logo ve Hoş Geldiniz Mesajı */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === "tr" ? "Logo ve Hoş Geldiniz Mesajı" : "Logo and Welcome Message"}
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getTranslation(language, "logo")}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64String = reader.result as string;
                              const updated = { ...restaurantInfo, logo: base64String };
                              setRestaurantInfo(updated);
                              saveInfoToLocalStorage(updated);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        {getTranslation(language, "orUseUrl")}
                      </p>
                      <input
                        type="url"
                        value={restaurantInfo.logo?.startsWith("data:") ? "" : (restaurantInfo.logo || "")}
                        onChange={(e) => {
                          const updated = { ...restaurantInfo, logo: e.target.value };
                          setRestaurantInfo(updated);
                          saveInfoToLocalStorage(updated);
                        }}
                        placeholder={getTranslation(language, "logoPlaceholder")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {restaurantInfo.logo && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Logo Önizleme:</p>
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-200 shadow-lg">
                            <img
                              src={restaurantInfo.logo}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getTranslation(language, "welcomeMessage")}
                    </label>
                    <input
                      type="text"
                      value={restaurantInfo.welcomeMessage || ""}
                      onChange={(e) => {
                        const updated = { ...restaurantInfo, welcomeMessage: e.target.value };
                        setRestaurantInfo(updated);
                        saveInfoToLocalStorage(updated);
                      }}
                      placeholder={getTranslation(language, "welcome")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === "tr"
                        ? "Boş bırakırsanız varsayılan 'Hoş Geldiniz' mesajı gösterilir."
                        : "Leave empty to show default 'Welcome' message."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Settings */}
        {activeTab === "theme" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ThemeSelector
              currentTheme={theme}
              onThemeChange={handleThemeChange}
              translations={translations[language]}
              language={language}
            />
          </div>
        )}

        {/* Currency Settings */}
        {activeTab === "currency" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation(language, "currency")} ({getTranslation(language, "currencySettings")})
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  {language === "tr"
                    ? "Varsayılan para birimini seçin. Müşteriler menüde farklı para birimleri arasında geçiş yapabilir."
                    : "Select the default currency. Customers can switch between different currencies in the menu."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(currencies).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setDefaultCurrency(curr.code);
                        saveCurrency(curr.code);
                        // Otomatik push kaldırıldı - sadece "Kaydet" butonuna basıldığında push edilecek
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${defaultCurrency === curr.code
                        ? "border-primary-600 bg-primary-50 ring-2 ring-primary-200"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="font-bold text-lg mb-1">
                        {curr.symbol} {curr.code}
                      </div>
                      <div className="text-sm text-gray-600">{curr.name}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {language === "tr" ? "Kur:" : "Rate:"} 1 TRY = {curr.rate} {curr.code}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {language === "tr" ? "Kur Güncelleme" : "Update Exchange Rates"}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {language === "tr"
                    ? "Kurları güncellemek için lib/currency.ts dosyasındaki rate değerlerini düzenleyin."
                    : "To update exchange rates, edit the rate values in lib/currency.ts file."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

