CREATE TABLE `tbl_paper` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `applicationId` bigint(20) unsigned NOT NULL,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '论文名称',
  `publish` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发表时间',
  `include` int(11) DEFAULT '0' COMMENT '是否被收藏或者引用',
  `factor` int(11) DEFAULT '0' COMMENT '影响因子',
  `sci` int(11) DEFAULT '0' COMMENT 'SCI引用次数',
  `ssci` int(11) DEFAULT '0' COMMENT 'SSCI引用次数',
  `cssi` int(11) DEFAULT '0' COMMENT 'CSSI引用次数',
  `score` int(11) DEFAULT NULL COMMENT '评分',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
