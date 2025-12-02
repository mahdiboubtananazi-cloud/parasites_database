import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Chip,
  useTheme,
  alpha,
  Collapse,
} from "@mui/material";
import { Search, Filter, X, Check } from "lucide-react";
import { useParasites } from "../hooks/useParasites";
import { useTranslation } from "react-i18next";


const fixImageUrl = (url?: string) => {
  if (!url) return "https://placehold.co/400x300?text=No+Image";
  if (url.includes("localhost")) {
    return url.replace(
      "localhost",
      window.location.hostname === "localhost" ? "localhost" : window.location.hostname
    );
  }
  return url;
};


interface Filters {
  types: string[];
  stages: string[];
  sampleTypes: string[];
  stainColors: string[];
  years: string[];
}


const Archive = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { parasites, loading } = useParasites();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    types: [],
    stages: [],
    sampleTypes: [],
    stainColors: [],
    years: [],
  });


  const itemsPerPage = 12;
  const { t } = useTranslation();
  const theme = useTheme();


  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchTerm(query);
  }, [searchParams]);


  // ✅ احسّن: احصل على الخيارات المتاحة بناءً على البيانات المصفاة الحالية
  const availableTypes = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    return Array.from(new Set(parasites.map((p) => p.type).filter(Boolean)))
      .sort()
      .map(type => ({
        value: type,
        count: parasites.filter(p => p.type === type).length
      }));
  }, [parasites]);


  const availableStages = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const stages = ["يرقة", "خادرة", "حوريات", "حشرة بالغة"];
    return stages.map(stage => ({
      value: stage,
      count: parasites.filter(p => (p as any).stage === stage).length
    })).filter(s => s.count > 0);
  }, [parasites]);


  const availableSampleTypes = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const types = ["دم", "براز", "بول", "لعاب", "أخرى"];
    return types.map(type => ({
      value: type,
      count: parasites.filter(p => (p as any).sampleType === type).length
    })).filter(t => t.count > 0);
  }, [parasites]);


  const availableStainColors = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const stains = ["صبغة طبيعية", "Lugol", "Ziehl Neelsen", "Giemsa"];
    return stains.map(stain => ({
      value: stain,
      count: parasites.filter(p => (p as any).stainColor === stain).length
    })).filter(s => s.count > 0);
  }, [parasites]);


  const availableYears = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    return Array.from(
      new Set(
        parasites
          .map((p) => {
            const d = new Date((p as any).createdAt);
            return isNaN(d.getTime()) ? null : d.getFullYear().toString();
          })
          .filter(Boolean)
      )
    )
      .sort((a, b) => Number(b) - Number(a))
      .map(year => ({
        value: year,
        count: parasites.filter(p => {
          const d = new Date((p as any).createdAt);
          return !isNaN(d.getTime()) && d.getFullYear().toString() === year;
        }).length
      }));
  }, [parasites]);


  // ✅ احسّن: تصفية آمنة وفعالة
  const filteredResults = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const term = searchTerm.toLowerCase().trim();
    
    return parasites.filter((p) => {
      // استبعد pending و rejected
      if ((p as any).status === "pending" || (p as any).status === "rejected") {
        return false;
      }

      // البحث النصي
      if (term.length > 0) {
        const searchMatch =
          (p.scientificName || "").toLowerCase().includes(term) ||
          (p.name || "").toLowerCase().includes(term) ||
          ((p as any).studentName || "").toLowerCase().includes(term) ||
          ((p as any).supervisorName || "").toLowerCase().includes(term) ||
          ((p as any).createdAt?.slice(0, 4) || "").includes(term);

        if (!searchMatch) return false;
      }

      // تطبيق الفلاتر - تحسين الأداء
      if (filters.types.length > 0 && !filters.types.includes(p.type || "")) {
        return false;
      }
      if (filters.stages.length > 0 && !filters.stages.includes((p as any).stage || "")) {
        return false;
      }
      if (filters.sampleTypes.length > 0 && !filters.sampleTypes.includes((p as any).sampleType || "")) {
        return false;
      }
      if (filters.stainColors.length > 0 && !filters.stainColors.includes((p as any).stainColor || "")) {
        return false;
      }
      if (filters.years.length > 0) {
        const year = (p as any).createdAt?.slice(0, 4);
        if (!year || !filters.years.includes(year)) return false;
      }

      return true;
    });
  }, [parasites, searchTerm, filters]);


  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);


  // ✅ احسّن: تحديث الفلاتر بكفاءة
  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentArr = prev[category];
      return {
        ...prev,
        [category]: currentArr.includes(value)
          ? currentArr.filter((v) => v !== value)
          : [...currentArr, value],
      };
    });
  };


  const clearFilters = () => {
    setFilters({
      types: [],
      stages: [],
      sampleTypes: [],
      stainColors: [],
      years: [],
    });
    setSearchTerm("");
  };


  // ✅ احسّن: مكون FilterSection محسّن مع العد
  const FilterSection = ({
    title,
    options,
    category,
  }: {
    title: string;
    options: Array<{ value: string; count: number }>;
    category: keyof Filters;
  }) => (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="subtitle2"
        fontWeight="700"
        color="text.primary"
        sx={{
          mb: 1.2,
          fontSize: "0.85rem",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: theme.palette.primary.main,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {options.length > 0 ? (
          options.map((option) => {
            const isSelected = filters[category].includes(option.value);
            return (
              <Chip
                key={`${category}-${option.value}`}
                label={
                  <span>
                    {option.value} <span style={{ opacity: 0.6, fontSize: "0.8em" }}>({option.count})</span>
                  </span>
                }
                onClick={() => toggleFilter(category, option.value)}
                size="medium"
                icon={isSelected ? <Check size={14} style={{ marginRight: 4 }} /> : undefined}
                onDelete={isSelected ? () => toggleFilter(category, option.value) : undefined}
                sx={{
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.grey[500], 0.08),
                  color: isSelected ? theme.palette.primary.main : "text.secondary",
                  borderColor: isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5),
                  borderWidth: "1px",
                  borderStyle: "solid",
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: "0.8rem",
                  height: "32px",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, 0.25)
                      : alpha(theme.palette.grey[500], 0.15),
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-2px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  },
                }}
              />
            );
          })
        ) : (
          <Typography variant="caption" color="text.disabled">
            لا توجد خيارات متاحة
          </Typography>
        )}
      </Box>
    </Box>
  );


  // ✅ احسّن: عداد الفلاتر النشطة
  const activeFiltersCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);


  return (
    <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "#F8F9FC" }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* Search & Filter Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backdropFilter: "blur(10px)",
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <TextField
                  fullWidth
                  placeholder={
                    t("search_placeholder") ||
                    "ابحث بالاسم العلمي أو اسم الطالب أو السنة"
                  }
                  size="medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color="#9CA3AF" />
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  variant="standard"
                  sx={{
                    bgcolor: "transparent",
                    "& .MuiInputBase-root": { fontSize: "1rem" },
                    "& .MuiInput-underline:before": { borderBottomColor: "transparent" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                      borderBottomColor: "transparent",
                    },
                  }}
                />
                <Button
                  variant={filtersOpen ? "contained" : "outlined"}
                  startIcon={filtersOpen ? <X size={20} /> : <Filter size={20} />}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  sx={{
                    whiteSpace: "nowrap",
                    minWidth: "120px",
                    borderRadius: 2,
                    borderColor: "divider",
                    color: filtersOpen ? "white" : "text.primary",
                    boxShadow: filtersOpen ? 2 : 0,
                    position: "relative",
                  }}
                >
                  {filtersOpen ? t("close") : t("filters")}
                  {activeFiltersCount > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: theme.palette.error.main,
                        color: "white",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                      }}
                    >
                      {activeFiltersCount}
                    </Box>
                  )}
                </Button>
              </Box>

              {/* Collapse Filter Content */}
              <Collapse in={filtersOpen} timeout="auto">
                <Box
                  sx={{
                    pt: 3,
                    mt: 1,
                    borderTop: "2px dashed",
                    borderColor: alpha(theme.palette.divider, 0.5),
                  }}
                >
                  {/* 3 Columns Layout for Desktop */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                      gap: 4,
                    }}
                  >
                    {/* Column 1 */}
                    <Box>
                      <Typography
                        variant="caption"
                        fontWeight={900}
                        color="primary"
                        sx={{
                          mb: 2.5,
                          display: "block",
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
                          fontSize: "0.75rem",
                        }}
                      >
                        {t("parasite_info") || "معلومات الطفيلي"}
                      </Typography>
                      <Stack spacing={2.5}>
                        <FilterSection
                          title={t("parasite_type") || "نوع الطفيلي"}
                          options={availableTypes}
                          category="types"
                        />
                        <FilterSection
                          title={t("parasite_stage") || "مرحلة الطفيلي"}
                          options={availableStages}
                          category="stages"
                        />
                      </Stack>
                    </Box>

                    {/* Column 2 */}
                    <Box
                      sx={{
                        borderLeft: { md: "1px solid" },
                        borderRight: { md: "1px solid" },
                        borderColor: { md: alpha(theme.palette.divider, 0.3) },
                        px: { md: 3 },
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={900}
                        color="primary"
                        sx={{
                          mb: 2.5,
                          display: "block",
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
                          fontSize: "0.75rem",
                        }}
                      >
                        {t("sample_details") || "تفاصيل العينة"}
                      </Typography>
                      <Stack spacing={2.5}>
                        <FilterSection
                          title={t("sample_type") || "نوع العينة"}
                          options={availableSampleTypes}
                          category="sampleTypes"
                        />
                        <FilterSection
                          title={t("stain_color") || "نوع الصبغة"}
                          options={availableStainColors}
                          category="stainColors"
                        />
                      </Stack>
                    </Box>

                    {/* Column 3 */}
                    <Box>
                      <Typography
                        variant="caption"
                        fontWeight={900}
                        color="primary"
                        sx={{
                          mb: 2.5,
                          display: "block",
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
                          fontSize: "0.75rem",
                        }}
                      >
                        {t("timeline") || "الفترة الزمنية"}
                      </Typography>
                      <Stack spacing={2.5}>
                        <FilterSection
                          title={t("year_added") || "السنة"}
                          options={availableYears}
                          category="years"
                        />
                      </Stack>

                      <Box sx={{ mt: 4, display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={clearFilters}
                          disabled={
                            !searchTerm &&
                            Object.values(filters).every((arr) => arr.length === 0)
                          }
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          {t("clear_all_filters") || "مسح جميع الفلاتر"}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Stack>
          </Paper>

          {/* Results count */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {filteredResults.length} {t("results_found")}
            </Typography>
            {activeFiltersCount > 0 && (
              <Typography variant="caption" color="primary" fontWeight={600}>
                {activeFiltersCount} فلتر نشط
              </Typography>
            )}
          </Box>

          {/* Results Grid */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : filteredResults.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                borderRadius: 3,
                border: "2px dashed",
                borderColor: "divider",
                textAlign: "center",
                bgcolor: alpha(theme.palette.grey[500], 0.05),
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm || activeFiltersCount > 0
                  ? "لم يتم العثور على نتائج"
                  : "لا توجد طفيليات متاحة"}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {searchTerm
                  ? `لا توجد نتائج لـ "${searchTerm}"`
                  : "جرب تغيير معايير البحث أو الفلاتر"}
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
              }}
            >
              {paginatedResults.map((sample) => (
                <Card
                  key={`parasite-${sample.id}`}
                  onClick={() => navigate(`/parasites/${sample.id}`)}
                  elevation={0}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={fixImageUrl(sample.imageUrl)}
                    alt={sample.scientificName}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ pb: 1.5 }}>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      gutterBottom
                      noWrap
                      sx={{ fontSize: "0.95rem" }}
                    >
                      {sample.scientificName}
                    </Typography>
                    {(sample as any).description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: "0.8rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {(sample as any).description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                      <Chip
                        label={(sample as any).createdAt?.slice(0, 10) || "تاريخ غير متوفر"}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          fontSize: "0.7rem",
                          height: 24,
                          borderColor: alpha(theme.palette.divider, 0.5),
                        }}
                      />
                      {sample.type && (
                        <Chip
                          label={sample.type}
                          size="small"
                          variant="filled"
                          sx={{
                            borderRadius: 1,
                            fontSize: "0.7rem",
                            height: 24,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Pagination */}
          {!loading && filteredResults.length > itemsPerPage && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, p) => setCurrentPage(p)}
                color="primary"
                shape="rounded"
                size="medium"
              />
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Archive;