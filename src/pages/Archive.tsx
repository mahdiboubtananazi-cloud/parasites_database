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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
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
  ChevronDown,
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
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    "types"
  );
  const [filters, setFilters] = useState<Filters>({
    types: [],
    stages: [],
    sampleTypes: [],
    stains: [],
    years: [],
  });

  const itemsPerPage = 12;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    const query = searchParams.get("search");
    if (query) setSearchTerm(query);
  }, [searchParams, i18n.language]);

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
        sampleTypesMap.set(
          sampleType,
          (sampleTypesMap.get(sampleType) || 0) + 1
        );
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
      const year =
        (p as any).createdAt?.slice(0, 4) ||
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

  // ✅ مكون FilterSection محسّن مع Accordion للهاتف
  const FilterSection = ({
    title,
    icon,
    options,
    category,
    accordionKey,
  }: {
    title: string;
    icon: string;
    options: Array<{ value: string; count: number }>;
    category: keyof Filters;
    accordionKey: string;
  }) => {
    const isSelected = filters[category].length > 0;

    if (isMobile) {
      return (
        <Accordion
          expanded={expandedAccordion === accordionKey}
          onChange={() =>
            setExpandedAccordion(
              expandedAccordion === accordionKey ? false : accordionKey
            )
          }
          sx={{
            mb: 1,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1.5,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ChevronDown size={20} />}
            sx={{
              bgcolor: isSelected
                ? alpha(theme.palette.primary.main, 0.08)
                : "transparent",
              py: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                fontSize: "0.9rem",
                color: isSelected
                  ? theme.palette.primary.main
                  : "text.primary",
              }}
            >
              {icon} {title}
            </Typography>
            {isSelected && (
              <Chip
                label={filters[category].length}
                size="small"
                sx={{
                  ml: "auto",
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                  fontWeight: "bold",
                  height: 24,
                }}
              />
            )}
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1, pb: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {options.length > 0 ? (
                options.map((option) => {
                  const isSelectedChip = filters[category].includes(
                    option.value
                  );
                  return (
                    <Chip
                      key={`${category}-${option.value}`}
                      label={`${option.value} (${option.count})`}
                      onClick={() => toggleFilter(category, option.value)}
                      size="small"
                      icon={
                        isSelectedChip ? (
                          <Check size={14} />
                        ) : undefined
                      }
                      onDelete={
                        isSelectedChip
                          ? () => toggleFilter(category, option.value)
                          : undefined
                      }
                      sx={{
                        bgcolor: isSelectedChip
                          ? alpha(theme.palette.primary.main, 0.2)
                          : alpha(theme.palette.grey[500], 0.08),
                        color: isSelectedChip
                          ? theme.palette.primary.main
                          : "text.secondary",
                        fontWeight: isSelectedChip ? 600 : 500,
                        fontSize: "0.75rem",
                      }}
                    />
                  );
                })
              ) : (
                <Typography variant="caption" color="text.disabled">
                  {t("no_options_available")}
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      );
    }

    // Desktop View
    return (
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
          {icon} {title}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {options.length > 0 ? (
            options.map((option) => {
              const isSelectedChip = filters[category].includes(option.value);
              return (
                <Chip
                  key={`${category}-${option.value}`}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
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
                    isSelectedChip ? (
                      <Check size={16} style={{ marginRight: 4 }} />
                    ) : undefined
                  }
                  onDelete={
                    isSelectedChip
                      ? () => toggleFilter(category, option.value)
                      : undefined
                  }
                  sx={{
                    bgcolor: isSelectedChip
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.grey[500], 0.08),
                    color: isSelectedChip
                      ? theme.palette.primary.main
                      : "text.secondary",
                    borderColor: isSelectedChip
                      ? theme.palette.primary.main
                      : alpha(theme.palette.divider, 0.5),
                    borderWidth: "1px",
                    borderStyle: "solid",
                    fontWeight: isSelectedChip ? 600 : 500,
                    fontSize: "0.8rem",
                    height: "32px",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: isSelectedChip
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
              {t("no_options_available")}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  // ✅ عداد الفلاتر النشطة
  const activeFiltersCount = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          {/* Header Section */}
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                mb: 1,
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("archive_title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              {t("archive_subtitle")}
            </Typography>
          </Box>

          {/* Search & Filter Bar */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backdropFilter: "blur(10px)",
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              transition: "all 0.3s ease",
            }}
          >
            <Stack spacing={2}>
              {/* Search Row */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  fullWidth
                  placeholder={t("search_placeholder")}
                  size="medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          size={20}
                          color={theme.palette.text.secondary}
                        />
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  variant="standard"
                  sx={{
                    bgcolor: "transparent",
                    "& .MuiInputBase-root": {
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      fontWeight: 500,
                    },
                  }}
                />
                <Button
                  variant={filtersOpen ? "contained" : "outlined"}
                  startIcon={filtersOpen ? <X size={18} /> : <Filter size={18} />}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  sx={{
                    whiteSpace: "nowrap",
                    minWidth: { xs: "100%", sm: "120px" },
                    borderRadius: 1.5,
                    borderColor: "divider",
                    boxShadow: filtersOpen ? 2 : 0,
                    fontWeight: 600,
                    position: "relative",
                    fontSize: { xs: "0.85rem", md: "1rem" },
                    py: 1,
                  }}
                >
                  {filtersOpen ? t("filters_close") : t("filters_open")}
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
                    pt: 2,
                    mt: 2,
                    borderTop: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
                  }}
                >
                  {isMobile ? (
                    <Stack spacing={1}>
                      <FilterSection
                        title={t("filter_parasite_type")}
                        icon="🔬"
                        options={availableTypes}
                        category="types"
                        accordionKey="types"
                      />
                      <FilterSection
                        title={t("filter_development_stage")}
                        icon="📊"
                        options={availableStages}
                        category="stages"
                        accordionKey="stages"
                      />
                      <FilterSection
                        title={t("filter_sample_type")}
                        icon="🧪"
                        options={availableSampleTypes}
                        category="sampleTypes"
                        accordionKey="sampleTypes"
                      />
                      <FilterSection
                        title={t("filter_stain_color")}
                        icon="🎨"
                        options={availableStains}
                        category="stains"
                        accordionKey="stains"
                      />
                      <FilterSection
                        title={t("filter_year")}
                        icon="📅"
                        options={availableYears}
                        category="years"
                        accordionKey="years"
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
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                          mt: 1,
                        }}
                      >
                        {t("filters_clear")}
                      </Button>
                    </Stack>
                  ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3 }}>
                      <FilterSection
                        title={t("filter_parasite_type")}
                        icon="🔬"
                        options={availableTypes}
                        category="types"
                        accordionKey="types"
                      />
                      <FilterSection
                        title={t("filter_development_stage")}
                        icon="📊"
                        options={availableStages}
                        category="stages"
                        accordionKey="stages"
                      />
                      <FilterSection
                        title={t("filter_sample_type")}
                        icon="🧪"
                        options={availableSampleTypes}
                        category="sampleTypes"
                        accordionKey="sampleTypes"
                      />
                      <FilterSection
                        title={t("filter_stain_color")}
                        icon="🎨"
                        options={availableStains}
                        category="stains"
                        accordionKey="stains"
                      />
                      <FilterSection
                        title={t("filter_year")}
                        icon="📅"
                        options={availableYears}
                        category="years"
                        accordionKey="years"
                      />
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
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
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          {t("filters_clear")}
                        </Button>
                      </Box>
                    </Box>
                  )}
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
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
              {filteredResults.length} {t("results_found")}{" "}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {t("results_from")} {parasites?.length || 0}
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
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                }}
              >
                {activeFiltersCount} {t("active_filters")}
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
                p: { xs: 4, md: 6 },
                borderRadius: 2,
                border: `2px dashed ${theme.palette.divider}`,
                textAlign: "center",
                bgcolor: alpha(theme.palette.grey[500], 0.05),
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
              >
                {searchTerm || activeFiltersCount > 0
                  ? t("no_results_found")
                  : t("no_samples_available")}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {searchTerm
                  ? t("search_no_match", { defaultValue: `${t("search_placeholder")} "${searchTerm}"` })
                  : t("try_changing_filters")}
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              {paginatedResults.map((sample) => (
                <Card
                  key={`parasite-${sample.id}`}
                  onClick={() => navigate(`/parasite/${sample.id}`)}
                  elevation={0}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: isMobile ? "none" : "translateY(-8px)",
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
                          transform: isMobile ? "none" : "scale(1.05)",
                        },
                      }}
                    />
                    {/* Type Badge */}
                    {sample.type && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          [i18n.language === "ar" ? "left" : "right"]: 10,
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
                  <CardContent
                    sx={{
                      pb: 1.5,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Scientific Name */}
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      noWrap
                      sx={{
                        fontSize: "0.9rem",
                        color: theme.palette.primary.main,
                        fontStyle: "italic",
                      }}
                    >
                      {sample.scientificName}
                    </Typography>

                    {/* Common Name */}
                    {sample.name &&
                      sample.name !== sample.scientificName && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{
                            mb: 1,
                            fontSize: "0.8rem",
                          }}
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
                          fontSize: "0.75rem",
                          lineHeight: 1.3,
                          flexGrow: 1,
                        }}
                      >
                        {(sample as any).description}
                      </Typography>
                    )}

                    {/* Meta Information */}
                    <Stack spacing={0.8}>
                      {/* Stage & Sample Type */}
                      {((sample as any).stage ||
                        (sample as any).sampleType) && (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {(sample as any).stage && (
                            <Chip
                              icon={<Microscope size={12} />}
                              label={(sample as any).stage}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderRadius: 0.8,
                                fontSize: "0.65rem",
                                height: 24,
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
                                borderRadius: 0.8,
                                fontSize: "0.65rem",
                                height: 24,
                                borderColor: alpha(
                                  theme.palette.divider,
                                  0.8
                                ),
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
                          spacing={0.5}
                          sx={{
                            flexWrap: "wrap",
                            gap: 0.5,
                            fontSize: "0.7rem",
                          }}
                        >
                          {(sample as any).studentName && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                                color: theme.palette.text.secondary,
                              }}
                            >
                              <User size={12} />
                              <Typography
                                component="span"
                                variant="caption"
                                noWrap
                                sx={{ maxWidth: "100px", fontSize: "0.65rem" }}
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
                                gap: 0.3,
                                color: theme.palette.text.secondary,
                              }}
                            >
                              <MapPin size={12} />
                              <Typography
                                component="span"
                                variant="caption"
                                noWrap
                                sx={{ maxWidth: "100px", fontSize: "0.65rem" }}
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
                          gap: 0.3,
                          color: theme.palette.text.secondary,
                          fontSize: "0.7rem",
                        }}
                      >
                        <Calendar size={12} />
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ fontSize: "0.65rem" }}
                        >
                          {(
                            (sample as any).createdAt ||
                            (sample as any).createdat ||
                            ""
                          )?.slice(0, 10) || "---"}
                        </Typography>
                      </Box>
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
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Archive;