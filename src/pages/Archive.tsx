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
  Grid,
} from "@mui/material";
import {
  Search,
  Filter,
  X,
  Check,
  MapPin,
  User,
  Microscope,
  Calendar,
} from "lucide-react";
import { useParasites } from "../hooks/useParasites";
import { useTranslation } from "react-i18next";

const fixImageUrl = (url?: string) => {
  if (!url) return "https://placehold.co/400x300?text=No+Image";
  if (url.includes("localhost")) {
    return url.replace(
      "localhost",
      window.location.hostname === "localhost"
        ? "localhost"
        : window.location.hostname
    );
  }
  return url;
};

interface Filters {
  types: string[];
  stages: string[];
  sampleTypes: string[];
  stains: string[];
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
    stains: [],
    years: [],
  });

  const itemsPerPage = 12;
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchTerm(query);
  }, [searchParams]);

  // ✅ احصل على الخيارات المتاحة - نوع الطفيلي
  const availableTypes = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    return Array.from(new Set(parasites.map((p) => p.type).filter(Boolean)))
      .sort()
      .map((type) => ({
        value: type,
        count: parasites.filter((p) => p.type === type).length,
      }));
  }, [parasites]);

  // ✅ احصل على الخيارات المتاحة - مرحلة الطفيلي
  const availableStages = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const stagesMap = new Map();
    parasites.forEach((p) => {
      const stage = (p as any).stage;
      if (stage) {
        stagesMap.set(stage, (stagesMap.get(stage) || 0) + 1);
      }
    });
    return Array.from(stagesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({
        value,
        count,
      }));
  }, [parasites]);

  // ✅ احصل على الخيارات المتاحة - نوع العينة
  const availableSampleTypes = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const sampleTypesMap = new Map();
    parasites.forEach((p) => {
      const sampleType = (p as any).sampleType;
      if (sampleType) {
        sampleTypesMap.set(sampleType, (sampleTypesMap.get(sampleType) || 0) + 1);
      }
    });
    return Array.from(sampleTypesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({
        value,
        count,
      }));
  }, [parasites]);

  // ✅ احصل على الخيارات المتاحة - الصبغة
  const availableStains = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const stainsMap = new Map();
    parasites.forEach((p) => {
      const stain = (p as any).stainColor;
      if (stain) {
        stainsMap.set(stain, (stainsMap.get(stain) || 0) + 1);
      }
    });
    return Array.from(stainsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({
        value,
        count,
      }));
  }, [parasites]);

  // ✅ احصل على الخيارات المتاحة - السنة
  const availableYears = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const yearsMap = new Map();
    parasites.forEach((p) => {
      const year = (p as any).createdAt?.slice(0, 4) || 
                   (p as any).createdat?.slice(0, 4);
      if (year) {
        yearsMap.set(year, (yearsMap.get(year) || 0) + 1);
      }
    });
    return Array.from(yearsMap.entries())
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([value, count]) => ({
        value,
        count,
      }));
  }, [parasites]);

  // ✅ تصفية آمنة وفعالة
  const filteredResults = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const term = searchTerm.toLowerCase().trim();

    return parasites.filter((p) => {
      // البحث النصي الشامل
      if (term.length > 0) {
        const searchMatch =
          (p.scientificName || "").toLowerCase().includes(term) ||
          (p.name || "").toLowerCase().includes(term) ||
          (p.type || "").toLowerCase().includes(term) ||
          ((p as any).studentName || "").toLowerCase().includes(term) ||
          ((p as any).host || "").toLowerCase().includes(term) ||
          ((p as any).location || "").toLowerCase().includes(term) ||
          ((p as any).description || "").toLowerCase().includes(term);

        if (!searchMatch) return false;
      }

      // تطبيق الفلاتر - نوع الطفيلي
      if (filters.types.length > 0 && !filters.types.includes(p.type || "")) {
        return false;
      }

      // تطبيق الفلاتر - مرحلة الطفيلي
      if (
        filters.stages.length > 0 &&
        !filters.stages.includes((p as any).stage || "")
      ) {
        return false;
      }

      // تطبيق الفلاتر - نوع العينة
      if (
        filters.sampleTypes.length > 0 &&
        !filters.sampleTypes.includes((p as any).sampleType || "")
      ) {
        return false;
      }

      // تطبيق الفلاتر - الصبغة
      if (
        filters.stains.length > 0 &&
        !filters.stains.includes((p as any).stainColor || "")
      ) {
        return false;
      }

      // تطبيق الفلاتر - السنة
      if (filters.years.length > 0) {
        const year =
          (p as any).createdAt?.slice(0, 4) ||
          (p as any).createdat?.slice(0, 4);
        if (!year || !filters.years.includes(year)) return false;
      }

      return true;
    });
  }, [parasites, searchTerm, filters]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // ✅ تحديث الفلاتر بكفاءة
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
      stains: [],
      years: [],
    });
    setSearchTerm("");
  };

  // ✅ مكون FilterSection محسّن
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
        fontWeight={700}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <span>{option.value}</span>
                    <span
                      style={{
                        opacity: 0.6,
                        fontSize: "0.75em",
                        fontWeight: 500,
                      }}
                    >
                      ({option.count})
                    </span>
                  </Box>
                }
                onClick={() => toggleFilter(category, option.value)}
                size="medium"
                icon={
                  isSelected ? (
                    <Check size={16} style={{ marginRight: 4 }} />
                  ) : undefined
                }
                onDelete={
                  isSelected
                    ? () => toggleFilter(category, option.value)
                    : undefined
                }
                sx={{
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.grey[500], 0.08),
                  color: isSelected
                    ? theme.palette.primary.main
                    : "text.secondary",
                  borderColor: isSelected
                    ? theme.palette.primary.main
                    : alpha(theme.palette.divider, 0.5),
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

  // ✅ عداد الفلاتر النشطة
  const activeFiltersCount = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <Box sx={{ minHeight: "100vh", py: 4, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Header Section */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("archive_title") || "أرشيف الطفيليات"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              {t("archive_subtitle") ||
                "قاعدة بيانات شاملة لجميع العينات الطفيلية الموثقة في المختبر"}
            </Typography>
          </Box>

          {/* Search & Filter Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              backdropFilter: "blur(10px)",
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              transition: "all 0.3s ease",
            }}
          >
            <Stack spacing={2.5}>
              {/* Search Row */}
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <TextField
                  fullWidth
                  placeholder="ابحث بالاسم العلمي أو الشائع أو الطالب أو الموقع..."
                  size="medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  variant="standard"
                  sx={{
                    bgcolor: "transparent",
                    "& .MuiInputBase-root": {
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                  }}
                />
                <Button
                  variant={filtersOpen ? "contained" : "outlined"}
                  startIcon={filtersOpen ? <X size={20} /> : <Filter size={20} />}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  sx={{
                    whiteSpace: "nowrap",
                    minWidth: "140px",
                    borderRadius: 2,
                    borderColor: "divider",
                    boxShadow: filtersOpen ? 2 : 0,
                    fontWeight: 600,
                    position: "relative",
                  }}
                >
                  {filtersOpen ? "إغلاق الفلاتر" : "الفلاتر"}
                  {activeFiltersCount > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: theme.palette.error.main,
                        color: "white",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
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
                    mt: 2,
                    borderTop: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
                  }}
                >
                  {/* 5 Columns Grid Layout */}
                  <Grid container spacing={3}>
                    {/* Column 1: نوع الطفيلي */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                      <FilterSection
                        title="🔬 نوع الطفيلي"
                        options={availableTypes}
                        category="types"
                      />
                    </Grid>

                    {/* Column 2: مرحلة الطفيلي */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                      <FilterSection
                        title="📊 مرحلة التطور"
                        options={availableStages}
                        category="stages"
                      />
                    </Grid>

                    {/* Column 3: نوع العينة */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                      <FilterSection
                        title="🧪 نوع العينة"
                        options={availableSampleTypes}
                        category="sampleTypes"
                      />
                    </Grid>

                    {/* Column 4: الصبغة */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                      <FilterSection
                        title="🎨 صبغة التلوين"
                        options={availableStains}
                        category="stains"
                      />
                    </Grid>

                    {/* Column 5: السنة والأزرار */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                      <FilterSection
                        title="📅 سنة الإضافة"
                        options={availableYears}
                        category="years"
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        fullWidth
                        onClick={clearFilters}
                        disabled={
                          !searchTerm &&
                          Object.values(filters).every((arr) => arr.length === 0)
                        }
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          mt: 1,
                        }}
                      >
                        مسح الفلاتر
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Stack>
          </Paper>

          {/* Results Statistics */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 2,
            }}
          >
            <Typography variant="body2" fontWeight={700}>
              {filteredResults.length} عينة{" "}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                من إجمالي {parasites?.length || 0}
              </Typography>
            </Typography>
            {activeFiltersCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 600,
                }}
              >
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
                border: `2px dashed ${theme.palette.divider}`,
                textAlign: "center",
                bgcolor: alpha(theme.palette.grey[500], 0.05),
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm || activeFiltersCount > 0
                  ? "لم يتم العثور على نتائج"
                  : "لا توجد عينات متاحة"}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {searchTerm
                  ? `لا توجد نتائج تطابق البحث عن "${searchTerm}"`
                  : "جرب تغيير معايير البحث أو الفلاتر"}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {paginatedResults.map((sample) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  key={`parasite-${sample.id}`}
                >
                  <Card
                    onClick={() => navigate(`/parasite/${sample.id}`)}
                    elevation={0}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 2.5,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    {/* Image Section */}
                    <Box sx={{ position: "relative", pt: "65%", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        image={fixImageUrl((sample as any).imageurl)}
                        alt={sample.scientificName}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                      {/* Type Badge */}
                      {sample.type && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                          }}
                        >
                          <Chip
                            label={sample.type}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.9),
                              color: "white",
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              height: 24,
                            }}
                          />
                        </Box>
                      )}
                    </Box>

                    {/* Content Section */}
                    <CardContent sx={{ pb: 1.5, flexGrow: 1 }}>
                      {/* Scientific Name */}
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                        noWrap
                        sx={{
                          fontSize: "0.95rem",
                          color: theme.palette.primary.main,
                          fontStyle: "italic",
                        }}
                      >
                        {sample.scientificName}
                      </Typography>

                      {/* Common Name */}
                      {sample.name && sample.name !== sample.scientificName && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ mb: 1, fontSize: "0.85rem" }}
                        >
                          {sample.name}
                        </Typography>
                      )}

                      {/* Description */}
                      {(sample as any).description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
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

                      {/* Meta Information */}
                      <Stack spacing={1}>
                        {/* Stage & Sample Type */}
                        {((sample as any).stage || (sample as any).sampleType) && (
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flexWrap: "wrap" }}
                          >
                            {(sample as any).stage && (
                              <Chip
                                icon={<Microscope size={14} />}
                                label={(sample as any).stage}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 1,
                                  fontSize: "0.7rem",
                                  height: 28,
                                  borderColor: alpha(
                                    theme.palette.primary.main,
                                    0.3
                                  ),
                                  color: theme.palette.primary.main,
                                }}
                              />
                            )}
                            {(sample as any).sampleType && (
                              <Chip
                                label={(sample as any).sampleType}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 1,
                                  fontSize: "0.7rem",
                                  height: 28,
                                  borderColor: alpha(theme.palette.divider, 0.8),
                                }}
                              />
                            )}
                          </Stack>
                        )}

                        {/* Student & Location */}
                        {((sample as any).studentName ||
                          (sample as any).location) && (
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flexWrap: "wrap", fontSize: "0.75rem" }}
                          >
                            {(sample as any).studentName && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                <User size={12} />
                                <Typography
                                  component="span"
                                  variant="caption"
                                  noWrap
                                  sx={{ maxWidth: "120px" }}
                                >
                                  {(sample as any).studentName}
                                </Typography>
                              </Box>
                            )}
                            {(sample as any).location && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                <MapPin size={12} />
                                <Typography
                                  component="span"
                                  variant="caption"
                                  noWrap
                                  sx={{ maxWidth: "120px" }}
                                >
                                  {(sample as any).location}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        )}

                        {/* Date */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: theme.palette.text.secondary,
                            fontSize: "0.75rem",
                          }}
                        >
                          <Calendar size={12} />
                          <Typography component="span" variant="caption">
                            {((sample as any).createdAt ||
                              (sample as any).createdat ||
                              ""
                            )?.slice(0, 10) || "---"}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
