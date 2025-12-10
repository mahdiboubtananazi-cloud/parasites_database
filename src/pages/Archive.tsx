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
  statuses: string[];
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
    statuses: [],
    years: [],
  });

  const itemsPerPage = 12;
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchTerm(query);
  }, [searchParams]);

  // ✅ احصل على الخيارات المتاحة بناءً على البيانات
  const availableTypes = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    return Array.from(new Set(parasites.map((p) => p.type).filter(Boolean)))
      .sort()
      .map((type) => ({
        value: type,
        count: parasites.filter((p) => p.type === type).length,
      }));
  }, [parasites]);

  const availableStages = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const stagesMap = new Map();
    parasites.forEach((p) => {
      const stage = (p as any).stage;
      if (stage) {
        stagesMap.set(stage, (stagesMap.get(stage) || 0) + 1);
      }
    });
    return Array.from(stagesMap.entries()).map(([value, count]) => ({
      value,
      count,
    }));
  }, [parasites]);

  const availableStatuses = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const statusLabels: Record<string, string> = {
      approved: "معتمد",
      pending: "قيد المراجعة",
      rejected: "مرفوض",
    };
    const statusMap = new Map();
    parasites.forEach((p) => {
      const status = (p as any).status || "approved";
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });
    return Array.from(statusMap.entries())
      .map(([value, count]) => ({
        value,
        label: statusLabels[value] || value,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [parasites]);

  const availableYears = useMemo(() => {
    if (!parasites || parasites.length === 0) return [];
    const yearsMap = new Map();
    parasites.forEach((p) => {
      const year = (p as any).createdat?.slice(0, 4);
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
      // البحث النصي
      if (term.length > 0) {
        const searchMatch =
          (p.scientificName || "").toLowerCase().includes(term) ||
          (p.name || "").toLowerCase().includes(term) ||
          (p.type || "").toLowerCase().includes(term) ||
          ((p as any).createdat?.slice(0, 4) || "").includes(term);

        if (!searchMatch) return false;
      }

      // تطبيق الفلاتر
      if (filters.types.length > 0 && !filters.types.includes(p.type || "")) {
        return false;
      }
      if (
        filters.stages.length > 0 &&
        !filters.stages.includes((p as any).stage || "")
      ) {
        return false;
      }
      if (filters.statuses.length > 0) {
        const status = (p as any).status || "approved";
        if (!filters.statuses.includes(status)) return false;
      }
      if (filters.years.length > 0) {
        const year = (p as any).createdat?.slice(0, 4);
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
      statuses: [],
      years: [],
    });
    setSearchTerm("");
  };

  // ✅ مكون FilterSection
  const FilterSection = ({
    title,
    options,
    category,
    labelMap,
  }: {
    title: string;
    options: Array<{ value: string; count: number; label?: string }>;
    category: keyof Filters;
    labelMap?: Record<string, string>;
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
            const displayLabel = option.label || labelMap?.[option.value] || option.value;
            return (
              <Chip
                key={`${category}-${option.value}`}
                label={
                  <span>
                    {displayLabel}{" "}
                    <span style={{ opacity: 0.6, fontSize: "0.8em" }}>
                      ({option.count})
                    </span>
                  </span>
                }
                onClick={() => toggleFilter(category, option.value)}
                size="medium"
                icon={
                  isSelected ? (
                    <Check size={14} style={{ marginRight: 4 }} />
                  ) : undefined
                }
                onDelete={
                  isSelected ? () => toggleFilter(category, option.value) : undefined
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
                  placeholder="ابحث بالاسم العلمي أو الاسم الشائع أو نوع الطفيلي"
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
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "transparent",
                    },
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
                  {filtersOpen ? "إغلاق" : "الفلاتر"}
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
                  {/* 4 Columns Layout for Desktop */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                      gap: 3,
                    }}
                  >
                    {/* Column 1: نوع الطفيلي */}
                    <Box>
                      <FilterSection
                        title="نوع الطفيلي"
                        options={availableTypes}
                        category="types"
                      />
                    </Box>

                    {/* Column 2: مرحلة الطفيلي */}
                    <Box>
                      <FilterSection
                        title="مرحلة الطفيلي"
                        options={availableStages}
                        category="stages"
                      />
                    </Box>

                    {/* Column 3: حالة العينة */}
                    <Box>
                      <FilterSection
                        title="حالة العينة"
                        options={availableStatuses as any}
                        category="statuses"
                      />
                    </Box>

                    {/* Column 4: السنة */}
                    <Box>
                      <FilterSection
                        title="سنة الإضافة"
                        options={availableYears}
                        category="years"
                      />
                      <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
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
                          }}
                        >
                          مسح الفلاتر
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Stack>
          </Paper>

          {/* Results count */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {filteredResults.length} عينة
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
                  : "لا توجد عينات متاحة"}
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
                    image={fixImageUrl((sample as any).imageurl)}
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
                        label={(sample as any).createdat?.slice(0, 10) || "---"}
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