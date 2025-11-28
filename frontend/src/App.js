import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [url, setUrl] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (taskId && status !== "completed" && status !== "failed") {
      interval = setInterval(() => {
        checkStatus();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [taskId, status]);

  const checkStatus = async () => {
    try {
      const response = await axios.get(`${API}/scrape/status/${taskId}`);
      const data = response.data;
      setStatus(data.status);
      setProgress(data.progress);
      setProducts(data.products);

      if (data.status === "completed") {
        toast.success(`${data.total_products} ürün başarıyla çekildi!`);
      } else if (data.status === "failed") {
        toast.error("Veri çekme işlemi başarısız: " + data.error);
      }
    } catch (error) {
      console.error("Status check error:", error);
    }
  };

  const handleScrape = async () => {
    if (!url) {
      toast.error("Lütfen bir URL girin");
      return;
    }

    setLoading(true);
    setStatus(null);
    setProducts([]);
    setProgress(0);

    try {
      const response = await axios.post(`${API}/scrape`, { url });
      setTaskId(response.data.task_id);
      setStatus("started");
      toast.info("Veri çekme işlemi başlatıldı...");
    } catch (error) {
      console.error("Scrape error:", error);
      toast.error("Bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get(`${API}/export/excel/${taskId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `hangifiltre_urunler_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success("Excel dosyası indirildi!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("İndirme sırasında hata oluştu");
    }
  };

  const getStatusBadge = () => {
    const statusMap = {
      started: { label: "Başlatıldı", variant: "default" },
      loading_page: { label: "Sayfa Yükleniyor", variant: "default" },
      extracting_data: { label: "Veri Çekiliyor", variant: "default" },
      processing: { label: "İşleniyor", variant: "default" },
      completed: { label: "Tamamlandı", variant: "success" },
      failed: { label: "Başarısız", variant: "destructive" }
    };

    const statusInfo = statusMap[status] || { label: "Bilinmiyor", variant: "secondary" };
    
    return (
      <Badge variant={statusInfo.variant} className="ml-2">
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            E-Ticaret Veri Çekme Aracı
          </h1>
          <p className="hero-subtitle">
            Hangifiltre.com sitesinden ürün bilgilerini otomatik olarak çekin ve Excel'e aktarın
          </p>
        </div>
      </div>

      <div className="main-content">
        <Card className="scraper-card">
          <CardHeader>
            <CardTitle>Veri Çekme İşlemi</CardTitle>
            <CardDescription>
              Site URL'sini girin ve kategorideki TÜM ürünleri otomatik olarak çekin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="input-group">
              <Input
                data-testid="url-input"
                type="text"
                placeholder="https://hangifiltre.com/kategori/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleScrape()}
                disabled={loading || (status && status !== "completed" && status !== "failed")}
              />
              <Button 
                data-testid="scrape-button"
                onClick={handleScrape}
                disabled={loading || (status && status !== "completed" && status !== "failed")}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Başlatılıyor...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Veri Çek
                  </>
                )}
              </Button>
            </div>

            {status && (
              <div className="status-section">
                <div className="status-header">
                  <span className="status-label">Durum:</span>
                  {getStatusBadge()}
                </div>
                
                {status !== "completed" && status !== "failed" && (
                  <div className="progress-section">
                    <Progress value={progress} className="progress-bar" />
                    <span className="progress-text">{progress}%</span>
                  </div>
                )}

                {status === "completed" && products.length > 0 && (
                  <div className="success-section">
                    <CheckCircle2 className="success-icon" />
                    <span className="success-text">
                      {products.length} ürün başarıyla çekildi!
                    </span>
                    <Button 
                      data-testid="download-excel-button"
                      onClick={handleDownloadExcel}
                      className="download-btn"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Excel İndir
                    </Button>
                  </div>
                )}

                {status === "failed" && (
                  <div className="error-section">
                    <AlertCircle className="error-icon" />
                    <span className="error-text">İşlem başarısız oldu</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {products.length > 0 && (
          <Card className="products-card">
            <CardHeader>
              <CardTitle>Çekilen Ürünler ({products.length})</CardTitle>
              <CardDescription>
                Aşağıda çekilen ürünlerin önizlemesini görebilirsiniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Görsel</TableHead>
                      <TableHead>Ürün Adı</TableHead>
                      <TableHead>Marka</TableHead>
                      <TableHead>Fiyat</TableHead>
                      <TableHead>Eski Fiyat</TableHead>
                      <TableHead>Stok</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.slice(0, 10).map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {product.image_url && product.image_url !== "N/A" ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="product-image"
                            />
                          ) : (
                            <div className="no-image">N/A</div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell className="text-green-600 font-semibold">{product.price}</TableCell>
                        <TableCell className="text-gray-400 line-through">{product.old_price}</TableCell>
                        <TableCell>
                          <Badge variant="success">{product.stock_status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {products.length > 10 && (
                  <div className="more-products">
                    +{products.length - 10} ürün daha (Excel'de görüntüleyin)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;