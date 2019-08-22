CREATE TABLE `tbl_renzhi` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `applicationId` bigint(20) unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '名称',
  `renzhi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任职',
  `score` int(11) DEFAULT '0' COMMENT '评分',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
