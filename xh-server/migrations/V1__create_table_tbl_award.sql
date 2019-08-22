CREATE TABLE `tbl_award` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `applicationId` bigint(20) unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '项目名称',
  `award` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '奖励名称',
  `orgnazation` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '机构',
  `level` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '奖励等级',
  `rank` int(11) DEFAULT '0' COMMENT '排名',
  `score` int(11) DEFAULT '0' COMMENT '评分',
  `year` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '年度',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
